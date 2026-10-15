"""Leaf 92 (`4.a.i.zo`) - complete `api.md`.

Phase 3 implemented a large number of methods but only ever appended the *new* resources to
`api.md`. Methods added to sections that already existed (notably `users`, `images`, `me`,
`posts` and `communities`) were never written down, so `api.md` advertised 377 endpoints
while `src/resources/**` exposed 459.

This script closes that gap. For every section it re-derives the full method list from the
owning class in `src/resources/**`, so `api.md` cannot drift from the code, and it creates the
nested sections (`posts.reactions`, `posts.mentions`, `posts.polls`) that had no section at all.

Run `./scripts/coverage` afterwards to confirm `api.md` still matches the inventory snapshot.

Usage: python3 scripts/research/gen-34-api.py
"""
import io
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# (parent heading or None, section heading, source file, class name, accessor prefix)
# parent is used to disambiguate the several `## Posts` / `## Likes` / `## Invites` headings.
EXTEND = [
    (None, '# Users', 'src/resources/users/users.ts', 'Users', 'users.'),
    (None, '# Me', 'src/resources/me.ts', 'Me', 'me.'),
    (None, '# Images', 'src/resources/images.ts', 'Images', 'images.'),
    (None, '# Posts', 'src/resources/posts/posts.ts', 'Posts', 'posts.'),
    (None, '# Communities', 'src/resources/communities/communities.ts', 'Communities', 'communities.'),
    ('# Posts', '## Comments', 'src/resources/posts/comments.ts', 'Comments', 'posts.comments.'),
    ('# Posts', '## Likes', 'src/resources/posts/likes.ts', 'Likes', 'posts.likes.'),
    ('# Communities', '## Posts', 'src/resources/communities/posts.ts', 'Posts', 'communities.posts.'),
    ('# Communities', '## Invites', 'src/resources/communities/invites.ts', 'Invites', 'communities.invites.'),
]

# Sections that do not exist yet; inserted before the anchor heading.
NEW_SECTIONS = [
    ('# Posts', '## Reactions', 'src/resources/posts/posts.ts', 'Reactions', 'posts.reactions.'),
    ('# Posts', '## Mentions', 'src/resources/posts/posts.ts', 'Mentions', 'posts.mentions.'),
    ('# Posts', '## Polls', 'src/resources/posts/posts.ts', 'Polls', 'posts.polls.'),
]

METHOD_RE = re.compile(r'^  ([A-Za-z]\w*)\((.*?)\): APIPromise<([^>]*)>', re.M | re.S)
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
    return re.sub(r'\$\{(\w+)\}', lambda m: '{%s}' % _placeholder(m.group(1)), template)


def _placeholder(name):
    """Match the convention api.md and the inventory already use: `{userId}`, not `{userID}`."""
    if name.endswith('ID'):
        name = name[:-2] + 'Id'
    parts = [p for p in name.split('_') if p]
    if len(parts) > 1:
        name = parts[0] + ''.join(p[:1].upper() + p[1:] for p in parts[1:])
    return name


def _class_body(src, class_name):
    m = re.search(r'^export class %s extends APIResource \{' % re.escape(class_name), src, re.M)
    assert m, 'class %s not found' % class_name
    nxt = re.search(r'^export class \w+ extends APIResource \{', src[m.end():], re.M)
    return src[m.end(): m.end() + nxt.start()] if nxt else src[m.end():]


def parse_methods(path, class_name):
    """Return [(method, verb, api_path, args, return_type)] for one class, in source order."""
    src = io.open(os.path.join(REPO, path), encoding='utf-8').read()
    body = _class_body(src, class_name)

    found = []
    for m in METHOD_RE.finditer(body):
        name, raw_params, ret = m.group(1), m.group(2), m.group(3).strip()
        call = CLIENT_RE.search(body, m.end())
        if not call:
            continue
        verb = call.group(1).upper()
        template = call.group(3) if call.group(3) is not None else call.group(4)
        api_path = _path_literal(template)

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
        found.append((name, verb, api_path, ', '.join(args), ret))
    return found


def types_for(path, class_name=None):
    """Interfaces to list under a section.

    With `class_name`, only interfaces the class actually mentions in its signatures, so
    `posts.reactions` does not inherit every interface `posts.ts` declares.
    """
    src = io.open(os.path.join(REPO, path), encoding='utf-8').read()
    names = [n for n in re.findall(r'^export interface (\w+)', src, re.M)
             if not n.endswith(PARAM_SUFFIX)]
    if class_name is None:
        return names
    body = _class_body(src, class_name)
    used = set(re.findall(r'\b([A-Z]\w+)\b', body))
    return [n for n in names if n in used]


def row(verb, api_path, accessor, method, args, ret, source):
    return ('- <code title="%s %s">client.%s<a href="./%s">%s</a>%s -> %s</code>'
            % (verb.lower(), api_path, accessor, source, method,
               ('(%s)' % args) if args else '()', ret))


def find_heading(api, heading, within=None):
    """Locate `heading`; when `within` is given, search only inside that heading's extent."""
    level = len(heading) - len(heading.lstrip('#'))
    title = heading.lstrip('# ').strip()
    pattern = re.compile(r'^%s %s\s*$' % ('#' * level, re.escape(title)), re.M)
    lo, hi = within if within else (0, len(api))
    m = pattern.search(api, lo, hi)
    if not m:
        return None
    nxt = re.compile(r'^#{1,%d} \S' % level, re.M).search(api, m.end())
    end = nxt.start() if nxt else len(api)
    if within:
        end = min(end, hi)
    return m.start(), end


def replace_method_list(api, extent, rows):
    """Swap the section's method rows for `rows`, keeping its Types block intact.

    The rows stop at the first nested heading, so a section that has subsections
    (`# Posts` owns `## Comments` and `## Likes`) keeps them.
    """
    start, end = extent
    section = api[start:end]
    m = re.search(r'^Methods:\n', section, re.M)
    assert m, 'no Methods: block in section starting %r' % section[:60]
    nested = re.search(r'^#{1,6} \S', section[m.end():], re.M)
    stop = m.end() + nested.start() if nested else len(section)
    new_section = section[:m.end()] + '\n' + '\n'.join(rows) + '\n\n' + section[stop:]
    return api[:start] + new_section + api[end:]


def main():
    path = os.path.join(REPO, 'api.md')
    api = io.open(path, encoding='utf-8').read()

    total = 0
    for parent, heading, source, cls, accessor in EXTEND:
        within = find_heading(api, parent) if parent else None
        extent = find_heading(api, heading, within)
        assert extent, 'section %s not found' % heading
        methods = parse_methods(source, cls)
        assert methods, 'no methods parsed from %s:%s' % (source, cls)
        api = replace_method_list(api, extent, [
            row(v, p, accessor, n, a, r, source) for n, v, p, a, r in methods
        ])
        total += len(methods)

    for anchor, heading, source, cls, accessor in NEW_SECTIONS:
        assert find_heading(api, heading) is None, '%s already present' % heading
        extent = find_heading(api, anchor)
        assert extent, 'anchor %s not found' % anchor
        methods = parse_methods(source, cls)
        assert methods, 'no methods parsed from %s:%s' % (source, cls)
        block = [heading, '']
        types = types_for(source, cls)
        if types:
            block += ['Types:', '']
            block += ['- <code><a href="./%s">%s</a></code>' % (source, t) for t in types]
            block += ['']
        block += ['Methods:', '']
        block += [row(v, p, accessor, n, a, r, source) for n, v, p, a, r in methods]
        # Insert at the END of the anchor's extent, so the new `##` sits after the anchor's own
        # methods and nested sections rather than before the anchor heading (which would adopt
        # whatever parent precedes it).
        at = extent[1]
        api = api[:at] + '\n'.join(block) + '\n\n' + api[at:]
        total += len(methods)

    io.open(path, 'w', encoding='utf-8').write(api)
    print('api.md: %d method rows written' % total)


if __name__ == '__main__':
    main()
