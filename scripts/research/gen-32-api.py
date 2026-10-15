"""Append the Phase 3.2 (leaves 41-61) resource sections to api.md.

`messaging` nests its resources as classes in one file, so each class becomes its own `##` block
with the matching accessor prefix. Run `./scripts/coverage` afterwards to check for drift.

Usage: python3 scripts/research/gen-32-api.py
"""
import io
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# (api.md heading, source file, accessor prefix)
FLAT_SECTIONS = [
    ('Library', 'src/resources/library.ts', 'library.'),
    ('Feeds', 'src/resources/feeds.ts', 'feeds.'),
]

# messaging: (api.md sub-heading, class name, accessor prefix)
MESSAGING = [
    ('Conversations', 'Conversations', 'messaging.conversations.'),
    ('Channels', 'Channels', 'messaging.channels.'),
    ('Attachments', 'Attachments', 'messaging.conversations.attachments.'),
    ('Blocks', 'Blocks', 'messaging.conversations.blocks.'),
    ('Members', 'Members', 'messaging.conversations.members.'),
    ('Messages', 'Messages', 'messaging.conversations.messages.'),
    ('Read Receipts', 'ReadReceipts', 'messaging.conversations.readReceipts.'),
]
MESSAGING_SOURCE = 'src/resources/messaging/messaging.ts'

METHOD_RE = re.compile(r'^  ([A-Za-z]\w*)\((.*?)\): APIPromise<([^>]*)>', re.M | re.S)
CLASS_RE = re.compile(r'^export class (\w+) extends APIResource \{', re.M)
CLIENT_RE = re.compile(r'this\._client\.(\w+)\(\s*(path`([^`]*)`|\'([^\']*)\')')

PARAM_SUFFIX = 'Params'


def _split_params(raw):
    parts, depth, cur = [], 0, ''
    for ch in raw:
        if ch in '([{<':
            depth += 1
        elif ch in ')]}>':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur.strip())
            cur = ''
        else:
            cur += ch
    if cur.strip():
        parts.append(cur.strip())
    return parts


def _path_literal(template):
    return re.sub(r'\$\{(\w+)\}', r'{\1}', template)


def parse_methods(src):
    """Return [(method, verb, api_path, args, return_type)] from a class body."""
    found = []
    for m in METHOD_RE.finditer(src):
        name, raw_params, ret = m.group(1), m.group(2), m.group(3).strip()
        call = CLIENT_RE.search(src, m.end())
        if not call:
            continue
        verb = call.group(1).upper()
        template = call.group(3) if call.group(3) is not None else call.group(4)
        positional, has_params = [], False
        for p in _split_params(raw_params):
            p = p.strip()
            if not p or p.startswith('options'):
                continue
            pname = p.split(':')[0].strip()
            ptype = p.split(':', 1)[1].strip() if ':' in p else ''
            if pname == 'body' or PARAM_SUFFIX in ptype or pname in ('params', 'query'):
                has_params = True
            else:
                positional.append(pname)
        args = list(positional) + (['{ ...params }'] if has_params else [])
        found.append((name, verb, _path_literal(template), ', '.join(args), ret))
    return found


def class_bodies(src):
    """Return [(class_name, body)] for every top-level resource class in `src`."""
    starts = [(m.group(1), m.start()) for m in CLASS_RE.finditer(src)]
    out = []
    for i, (name, pos) in enumerate(starts):
        end = starts[i + 1][1] if i + 1 < len(starts) else len(src)
        out.append((name, src[pos:end]))
    return out


def types_for(path):
    src = io.open(os.path.join(REPO, path), encoding='utf-8').read()
    names = re.findall(r'^export interface (\w+)', src, re.M)
    return [n for n in names if not n.endswith(PARAM_SUFFIX)]


def row(verb, api_path, accessor, method, args, ret, source):
    return ('- <code title="%s %s">client.%s<a href="./%s">%s</a>%s -> %s</code>'
            % (verb.lower(), api_path, accessor, source, method,
               ('(%s)' % args) if args else '()', ret))


def main():
    api = io.open(os.path.join(REPO, 'api.md'), encoding='utf-8').read().rstrip('\n')

    for title, _source, _accessor in FLAT_SECTIONS:
        api = re.sub(r'\n# %s\n.*?(?=\n# |\Z)' % re.escape(title), '', api, flags=re.S)
    api = re.sub(r'\n# Messaging\n.*?(?=\n# |\Z)', '', api, flags=re.S)
    api = api.rstrip('\n')

    total = 0
    for title, source, accessor in FLAT_SECTIONS:
        methods = parse_methods(io.open(os.path.join(REPO, source), encoding='utf-8').read())
        assert methods, 'no methods parsed from %s' % source
        lines = ['', '# %s' % title, '']
        types = types_for(source)
        if types:
            lines += ['Types:', '']
            lines += ['- <code><a href="./%s">%s</a></code>' % (source, t) for t in types]
            lines += ['']
        lines += ['Methods:', '']
        lines += [row(v, p, accessor, n, a, r, source) for n, v, p, a, r in methods]
        api += '\n'.join(lines)
        total += len(methods)

    # Messaging: one `#` heading with a `##` sub-heading per nested class.
    src = io.open(os.path.join(REPO, MESSAGING_SOURCE), encoding='utf-8').read()
    bodies = dict(class_bodies(src))
    lines = ['', '# Messaging', '']
    types = types_for(MESSAGING_SOURCE)
    if types:
        lines += ['Types:', '']
        lines += ['- <code><a href="./%s">%s</a></code>' % (MESSAGING_SOURCE, t) for t in types]
        lines += ['']
    for heading, class_name, accessor in MESSAGING:
        body = bodies[class_name]
        methods = parse_methods(body)
        assert methods, 'no methods parsed from messaging class %s' % class_name
        lines += ['## %s' % heading, '', 'Methods:', '']
        lines += [row(v, p, accessor, n, a, r, MESSAGING_SOURCE) for n, v, p, a, r in methods]
        lines += ['']
        total += len(methods)
    api += '\n'.join(lines).rstrip('\n')

    io.open(os.path.join(REPO, 'api.md'), 'w', encoding='utf-8').write(api + '\n')
    print('api.md: %d new method rows' % total)


if __name__ == '__main__':
    main()
