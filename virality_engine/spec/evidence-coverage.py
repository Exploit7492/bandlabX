"""Template-aware APK-evidence coverage: does every evidenced path have a client call?

Unlike `open-leaves.py`, this collapses templated call paths (`path`/validation/${entityType}``)
to the same placeholder form the evidence uses, so a generic method can cover several evidenced
rows. Reports the count and any genuinely uncovered evidenced path.

Usage: python3 scripts/research/evidence-coverage.py
"""
import io
import re
import os
import sys

EVIDENCE = 'docs/research/apk-endpoints.md'
ROW = re.compile(r'^\|\s*`(GET|POST|PUT|PATCH|DELETE)`\s*\|\s*(yes|no)\s*\|\s*`([^`]+)`')


def norm(path):
    """Collapse every path parameter to a single placeholder."""
    path = path.split('?')[0].strip()
    path = re.sub(r'\$\{[^}]+\}', '{}', path)
    path = re.sub(r'\{[^}]+\}', '{}', path)
    return path.strip('/')


# `validate(entityType)` takes a literal union, so one method serves the three evidenced
# `validation/{entityType}` rows. Listed here rather than inferred so the gap stays visible.
COVERED_BY_GENERIC = {
    ('GET', 'validation/band'): 'client.validation.validate("band")',
    ('GET', 'validation/user'): 'client.validation.validate("user")',
    ('GET', 'validation/song'): 'client.validation.validate("song")',
}


def client_calls():
    """Every `this._client.<verb>(...)` path in src/resources, template-aware."""
    calls = set()
    pat = re.compile(
        r'this\._client\.(get|post|put|patch|delete)\(\s*(?:path`([^`]*)`|\'([^\']*)\'|"([^"]*)")'
    )
    for root, _dirs, files in os.walk('src/resources'):
        for f in files:
            if not f.endswith('.ts'):
                continue
            text = io.open(os.path.join(root, f), encoding='utf-8').read()
            for m in pat.finditer(text):
                verb = m.group(1).upper()
                template = next(g for g in m.groups()[1:] if g is not None)
                calls.add((verb, norm(template)))
    return calls


def evidenced():
    rows = set()
    for line in io.open(EVIDENCE, encoding='utf-8'):
        m = ROW.match(line.strip())
        if m:
            rows.add((m.group(1), norm(m.group(3))))
    return rows


def main():
    calls = client_calls()
    ev = evidenced()
    covered = ev & calls
    missing = sorted(ev - calls - set(COVERED_BY_GENERIC))
    print('evidenced   %d' % len(ev))
    print('client calls (verb+path, deduped) %d' % len(calls))
    print('covered     %d' % (len(covered) + len(set(COVERED_BY_GENERIC) & ev)))
    print('remaining   %d' % len(missing))
    for verb, path in missing:
        print('  MISSING %-6s /%s' % (verb, path))
    return 0 if not missing else 1


if __name__ == '__main__':
    sys.exit(main())
