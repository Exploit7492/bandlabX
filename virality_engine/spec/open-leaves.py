"""List open leaves with their evidenced paths and response shapes."""
import io, re, os, collections


def norm(p):
    p = p.split('?')[0]
    p = re.sub(r'\$\{[^}]+\}', '{id}', p)
    p = re.sub(r'\{[^}]+\}', '{id}', p)
    return p.strip('/')


impl = set()
pat = re.compile(r'this\._client\.(get|post|put|patch|delete)\(\s*(?:path)?[`\'"]([^`\'"]+)[`\'"]')
for root, dirs, files in os.walk('src/resources'):
    for f in files:
        if f.endswith('.ts'):
            t = io.open(os.path.join(root, f), encoding='utf-8').read()
            for m in pat.finditer(t):
                impl.add((m.group(1).upper(), norm(m.group(2))))

shapes = collections.defaultdict(list)
for line in io.open('docs/research/apk-shapes.tsv', encoding='utf-8'):
    if line.startswith('#'):
        continue
    parts = line.rstrip('\n').split('\t')
    if len(parts) >= 2:
        shapes[parts[0]].append((parts[1], parts[2] if len(parts) > 2 else ''))

txt = io.open('docs/handover/TASKS.md', encoding='utf-8').read()
blocks = re.split(r'\n\*\*(?=\d+ - )', txt)
for b in blocks:
    m = re.match(r'(\d+) - `([^`]+)` - (.+?)\*\*', b)
    if not m:
        continue
    num = int(m.group(1)); lid = m.group(2); title = m.group(3).strip()
    fm = re.search(r'file `([^`]+)`', b)
    paths = re.findall(r'^- `(GET|POST|PUT|PATCH|DELETE) ([^`]+)` -> `([^`]+)`', b, re.M)
    miss = [(v, p, s) for v, p, s in paths if (v, norm(p)) not in impl]
    if not miss or num < 63:
        continue
    print(f'=== LEAF {num} {lid} | file {fm.group(1) if fm else "?"} | {title}')
    for v, p, s in miss:
        print(f'  {v:6} {p}')
        print(f'         shape: {s}')
        if s in shapes:
            print(f'         fields: {", ".join(f for f, _ in shapes[s])}')
