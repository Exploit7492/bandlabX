#!/usr/bin/env python3
"""Extract BandLab API endpoints and response shapes from a jadx decompile of the APK.

Why this exists
---------------
The web bundle (`docs/research/BUNDLE-EVIDENCE.md`) proves which PATHS exist but carries
no types. The Android app ships the same API surface as Kotlin interfaces, and because it
uses kotlinx.serialization the serializer descriptors keep the ORIGINAL class and field
names even though the dex is obfuscated. That makes request/response shapes recoverable.

How the app describes an endpoint (all names below are obfuscated in the dex, the roles
are stable):

    @ApiService(endpoint = j11.g, isAuthorized = true)
    public interface TrackVideoPostsService {
        @xbc("revisions/{id}/track-videos/posts")
        Object getRevisionVideoPosts(@acl("id") String s, @cao juk p, ng7<? super qtk<fom>> c);
    }

  * `@ApiService.endpoint` is a `j11` constant naming the host group (ACCOUNTS, SOUNDS, ...).
  * The path annotation class maps to an HTTP verb. The mapping is NOT printed in the dex,
    so it is derived from the method names (which Kotlin does not obfuscate) and is recorded
    in `docs/research/APK-EVIDENCE.md`.
  * The response model is the argument of the Kotlin continuation `ng7<? super ...>`, not the
    Java return type (jadx renders that as bare `Object`).

Usage
-----
    jadx -j 4 --no-res -d /tmp/blsrc base.apk
    python3 scripts/research/apk-to-endpoints.py /tmp/blsrc/sources out/

Writes `apk-endpoints.md` and `apk-shapes.tsv` into the output directory. Stdlib only.
"""

import os
import re
import sys
from collections import Counter, defaultdict

# Path annotation class -> HTTP verb. Derived by matching methods whose names carry an
# unambiguous verb against the paths the OpenAPI spec lists, then cross-checked inside
# single service files. See APK-EVIDENCE.md "verb map" for the evidence and the confidence.
ANN_TO_VERB = {
    'xbc': 'GET',     # 234/237 method names begin get/list/search/...
    'kik': 'POST',    # 91/107 begin create/add/post/...
    'sa8': 'DELETE',  # 44/52 begin delete/remove/unfollow/...
    'thk': 'PATCH',   # 30/33 begin update/mark/save/...
    'lik': 'PUT',     # 15/28 direct; resolved to PUT by in-file coherence (see doc)
}

# Parameter annotations, never path-bearing.
PARAM_ANNS = {'acl', 'cao', 'c74', 'z9o'}

SVC_RE = re.compile(
    r'@ApiService\(endpoint\s*=\s*j11\.(\w+)\s*,\s*isAuthorized\s*=\s*(true|false)'
)
# A method: @ann("path") on one line, the declaration up to its terminating ';'.
METH_RE = re.compile(r'@([a-z][a-z0-9]{1,6})\("([^"]*)"\)\s*\n\s*(.*?);', re.S)
CONT_RE = re.compile(r'ng7<\?\s*super\s+([^>]+(?:>[^>]*)?)>')

DESC_RE = re.compile(r'new dkm\("([^"]+)"')
FIELD_RE = re.compile(r'\.j\("([^"]+)"\s*,\s*(true|false)')
COMPANION_RE = re.compile(r'public static final\s+([a-z][a-z0-9]{1,6})\s+Companion')
SERIALIZER_RE = re.compile(r'return\s+([a-z][a-z0-9]{1,6})\.a\s*;')

# j11 static initializer: `new j11("NAME", idx);` then `letter = var;`
J11_CONST_RE = re.compile(r'new j11\("([A-Z0-9_]+)",\s*(\d+)\)')
J11_LETTER_RE = re.compile(r'\b([a-zA-Z])\s*=\s*j11Var\d+;')


def read_tree(src):
    """Yield (class_name, path, text) for every .java file under src."""
    for root, _, files in os.walk(src):
        for fn in files:
            if fn.endswith('.java'):
                p = os.path.join(root, fn)
                try:
                    yield os.path.splitext(fn)[0], p, open(
                        p, encoding='utf-8', errors='replace').read()
                except OSError:
                    continue


def host_letters(src):
    """Map the obfuscated `j11.<letter>` field to its real enum name."""
    for cls, _, text in read_tree(src):
        if cls != 'j11' or 'new j11("ACCOUNTS"' not in text:
            continue
        block = text[text.find('static {'):]
        names = J11_CONST_RE.findall(block)
        letters = J11_LETTER_RE.findall(block)
        return dict(zip(letters, [n for n, _ in names]))
    return {}


def serializer_shapes(src):
    """serializer class -> {'fqcn', 'fields'}; then model class -> same, via the Companion."""
    serializers, companions = {}, {}
    for cls, _, text in read_tree(src):
        m = DESC_RE.search(text)
        if m:
            fields = FIELD_RE.findall(text)
            if fields:
                serializers[cls] = {
                    'fqcn': m.group(1),
                    'fields': [{'name': n, 'required': r == 'true'} for n, r in fields],
                }
        if 'serializer()' in text:
            m2 = SERIALIZER_RE.search(text)
            if m2:
                companions[cls] = m2.group(1)

    models = {}
    for cls, _, text in read_tree(src):
        m = COMPANION_RE.search(text)
        if m and companions.get(m.group(1)) in serializers:
            models[cls] = serializers[companions[m.group(1)]]
    return serializers, models


def extract(src):
    letters = host_letters(src)
    _, models = serializer_shapes(src)

    def resolve(text):
        out = []
        for t in re.findall(r'\b([a-z][a-z0-9]{1,5})\b', text):
            if t in models:
                sh = models[t]
                if not any(f['class'] == sh['fqcn'] for f in out):
                    out.append({'class': sh['fqcn'], 'fields': sh['fields']})
        return out

    records = []
    for cls, _, text in read_tree(src):
        svc = SVC_RE.search(text)
        if not svc:
            continue
        for ann, path, decl in METH_RE.findall(text):
            if ann in PARAM_ANNS or ann not in ANN_TO_VERB:
                continue
            head = decl.split('(')[0].strip()
            name = head.split()[-1] if head.split() else ''
            shape = []
            for cont in CONT_RE.findall(decl):
                shape.extend(resolve(cont))
            records.append({
                'service': cls,
                'host': letters.get(svc.group(1), svc.group(1)),
                'authorized': svc.group(2) == 'true',
                'verb': ANN_TO_VERB[ann],
                'path': path,
                'method': name,
                'response_shapes': shape,
            })
    return records


def normalize(path):
    return re.sub(r'\{[^}]+\}', '{}', '/' + path.strip('/'))


def sdk_paths(inventory):
    sdk = set()
    if not os.path.exists(inventory):
        return sdk
    for line in open(inventory, encoding='utf-8'):
        m = re.search(r'(/[a-zA-Z0-9_{}/-]+)', line)
        if m:
            sdk.add(normalize(m.group(1)))
    return sdk


def write_endpoints(records, sdk, out_path):
    best = {}
    for r in records:
        k = normalize(r['path'])
        if k in sdk:
            continue
        cur = best.get(k)
        if cur is None or (not cur['response_shapes'] and r['response_shapes']):
            best[k] = r

    by_seg = defaultdict(list)
    for k, r in sorted(best.items()):
        seg = [x for x in k.split('/') if x]
        by_seg[seg[0] if seg else '(root)'].append(r)

    with open(out_path, 'w', encoding='utf-8') as fh:
        fh.write('# APK endpoint evidence\n\n')
        fh.write('Generated by `scripts/research/apk-to-endpoints.py` from a jadx decompile '
                 'of the BandLab Android app (11.33.2). Every row is a path the SDK does not '
                 'expose today. `verb` comes from the annotation map, `auth` from '
                 '`@ApiService.isAuthorized`, and `shape` from the kotlinx.serialization '
                 'descriptor (real class and field names).\n\n')
        fh.write('Totals: **%d paths**, %d with a verb, %d with a response shape, '
                 '%d distinct response classes.\n\n' % (
                     len(best),
                     len({k for k, r in best.items() if r['verb']}),
                     len({k for k, r in best.items() if r['response_shapes']}),
                     len({f['class'] for r in best.values() for f in r['response_shapes']}),
                 ))
        for seg in sorted(by_seg):
            fh.write('## `/%s` (%d)\n\n' % (seg, len(by_seg[seg])))
            fh.write('| Verb | Auth | Path | Service | Response |\n')
            fh.write('|---|---|---|---|---|\n')
            for r in sorted(by_seg[seg], key=lambda x: (x['verb'], x['path'])):
                shape = r['response_shapes'][0]['class'] if r['response_shapes'] else '—'
                fh.write('| `%s` | %s | `%s` | `%s` | %s |\n' % (
                    r['verb'], 'yes' if r['authorized'] else 'no',
                    r['path'], r['service'], shape))
            fh.write('\n')
    return best


def write_shapes(src, out_path):
    serializers, models = serializer_shapes(src)
    rows = {v['fqcn']: v['fields'] for v in models.values()}
    with open(out_path, 'w', encoding='utf-8') as fh:
        fh.write('# class\tfield\trequired\n')
        for fqcn in sorted(rows):
            for f in rows[fqcn]:
                fh.write('%s\t%s\t%s\n' % (fqcn, f['name'], 'true' if f['required'] else 'false'))
    return rows


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else '/tmp/blsrc/sources'
    outdir = sys.argv[2] if len(sys.argv) > 2 else 'docs/research'
    inventory = 'docs/handover/endpoint-inventory.tsv'
    os.makedirs(outdir, exist_ok=True)

    records = extract(src)
    sdk = sdk_paths(inventory)
    best = write_endpoints(records, sdk, os.path.join(outdir, 'apk-endpoints.md'))
    shapes = write_shapes(src, os.path.join(outdir, 'apk-shapes.tsv'))

    print('services:            %d' % len({r['service'] for r in records}))
    print('methods:             %d' % len(records))
    print('paths (all):         %d' % len({normalize(r['path']) for r in records}))
    print('paths not in SDK:    %d' % len(best))
    print('  with a verb:       %d' % len({k for k, r in best.items() if r['verb']}))
    print('  with a shape:      %d' % len({k for k, r in best.items() if r['response_shapes']}))
    print('response classes:    %d' % len(shapes))
    print('segments:            %d' % len(Counter(
        (normalize(r['path']).split('/') + [''])[1] for r in best.values())))


if __name__ == '__main__':
    main()
