"""Merge `./scripts/coverage --markdown` into docs/endpoint-status.md without losing hand edits.

The Status column in `endpoint-status.md` is edited by hand as evidence arrives, so it must never be
regenerated wholesale. This script:

  1. reads the existing file and keeps every Status it already records, keyed by verb + path;
  2. adds the rows the seed has and the file does not, taking Status from `apk-endpoints.md`
     (`apk` when the APK gave a response shape, `apk-path-only` when it gave only the path);
  3. leaves rows that are in the file but no longer in the seed untouched, so nothing is dropped
     silently.

Rows are keyed by verb + normalised path, matching how `har-to-endpoints.py` keys the table.

Usage: python3 scripts/research/sync-endpoint-status.py [--check]
"""
import io
import os
import re
import sys
import subprocess

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STATUS = os.path.join(REPO, 'docs', 'endpoint-status.md')
APK = os.path.join(REPO, 'docs', 'research', 'apk-endpoints.md')

ROW = re.compile(r'^\|\s*`(\w[\w-]*)`\s*\|\s*`?(\w+)`?\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|$')
APK_ROW = re.compile(r'^\|\s*`(\w+)`\s*\|\s*\w+\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*(.*?)\s*\|$')

HEADER = """# Endpoint Status

One row per endpoint the SDK exposes, sorted by SDK accessor. Seeded by `./scripts/coverage --markdown` from `api.md`;
after that the **Status** column is edited by hand as evidence arrives. Do not regenerate over a hand-edited file.
To check that `api.md` still matches the inventory snapshot, run `./scripts/coverage`.

| Status          | Meaning                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `spec`          | in the original OpenAPI spec; never run against BandLab from this repo |
| `captured`      | seen in a real request capture supplied by the owner                   |
| `unverified`    | inferred or added without evidence                                     |
| `live-ok`       | the owner ran it successfully against BandLab                          |
| `apk`           | path, verb and response shape read from the APK decompile              |
| `apk-path-only` | path and verb read from the APK; the app gives no response shape       |
| `missing`       | looked for, not found                                                  |
"""


def norm_path(path):
    path = path.split('?')[0].strip()
    path = re.sub(r'\{[^}]+\}', '{}', path)
    return '/' + path.strip('/')


def key(verb, path):
    return (verb.upper(), norm_path(path))


def parse_status(text):
    """Existing rows as {key: (status, verb, path, call, source)} plus header extras."""
    rows, order = {}, []
    for line in text.split('\n'):
        m = ROW.match(line.strip())
        if m:
            status, verb, path, call, source = m.groups()
            k = key(verb, path)
            rows[k] = (status, verb, path, call, source)
            order.append(k)
    return rows, order


def summary_line(text):
    """The `**N endpoints: ...**` line, or None when the file has no summary."""
    for line in text.split('\n'):
        if line.startswith('**') and 'endpoints:' in line:
            return re.sub(r'\s+', ' ', line.strip())
    return None


def parse_seed(text):
    rows, order = {}, []
    for line in text.split('\n'):
        m = ROW.match(line.strip())
        if m:
            status, verb, path, call, source = m.groups()
            k = key(verb, path)
            rows[k] = (status, verb, path, call, source)
            order.append(k)
    return rows, order


def apk_shapes():
    """{(verb, path): has_response_shape} from the APK evidence table."""
    out = {}
    for line in io.open(APK, encoding='utf-8'):
        m = APK_ROW.match(line.strip())
        if m:
            verb, path, _service, response = m.groups()
            out[key(verb, path)] = response not in ('—', '-', '')
    return out


def main():
    check = '--check' in sys.argv
    seed = subprocess.run(
        ['./scripts/coverage', '--markdown'],
        cwd=REPO, capture_output=True, text=True, check=True,
    ).stdout
    seed_rows, seed_order = parse_seed(seed)

    existing = ''
    if os.path.exists(STATUS):
        existing = io.open(STATUS, encoding='utf-8').read()
    old_rows, _old_order = parse_status(existing)

    shapes = apk_shapes()

    def status_for(k, default):
        if k in old_rows and old_rows[k][0] != 'spec':
            return old_rows[k][0]
        if k in shapes:
            return 'apk' if shapes[k] else 'apk-path-only'
        return default

    merged = {}
    for k in seed_order:
        status, verb, path, call, source = seed_rows[k]
        merged[k] = (status_for(k, status), verb, path, call, source)

    # Rows the file has that the seed no longer lists: keep them so nothing is dropped silently.
    dropped = [k for k in old_rows if k not in merged]
    for k in dropped:
        merged[k] = old_rows[k]

    counts = {}
    for status, *_rest in merged.values():
        counts[status] = counts.get(status, 0) + 1
    tally = ', '.join('%d `%s`' % (counts[s], s) for s in sorted(counts))

    lines = [HEADER, '', '**%d endpoints: %s.**' % (len(merged), tally), '',
             '| Status | Verb | Path | SDK call | Source |',
             '|--------|------|------|----------|--------|']
    for k in seed_order + dropped:
        status, verb, path, call, source = merged[k]
        lines.append('| `%s` | %s | `%s` | `%s` | `%s` |' % (status, verb.upper(), path, call, source))
    out = '\n'.join(lines) + '\n'

    if check:
        # Compare parsed rows, not raw text: Prettier pads the table columns on `./scripts/format`,
        # so a byte comparison would report "out of date" for a file that has the same content.
        new_rows, new_order = parse_status(out)
        old_rows_p, old_order = parse_status(existing)
        if new_rows != old_rows_p or new_order != old_order:
            print('endpoint-status.md is out of date; run without --check to rewrite')
            return 1
        if summary_line(out) != summary_line(existing):
            print('endpoint-status.md summary line is out of date; run without --check to rewrite')
            return 1
        print('endpoint-status.md is up to date')
        return 0

    io.open(STATUS, 'w', encoding='utf-8').write(out)
    print('endpoint-status.md: %d rows (%s), %d carried over from the previous file'
          % (len(merged), tally, sum(1 for k in merged if k in old_rows)))
    if dropped:
        print('  kept %d row(s) no longer in api.md: %s'
              % (len(dropped), ', '.join('%s %s' % (v, p) for _s, v, p, _c, _src in
                                         (old_rows[k] for k in dropped))))
    return 0


if __name__ == '__main__':
    sys.exit(main())
