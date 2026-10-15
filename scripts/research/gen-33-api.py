"""Append the Phase 3.3 (leaves 63-90) resource sections to api.md.

Signatures are parsed straight out of `src/resources/**` so `api.md` cannot drift from the code.
Run `./scripts/coverage` afterwards to re-derive the inventory and check for drift.

Usage: python3 scripts/research/gen-33-api.py
"""
import io
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# (api.md heading, source file, resource accessor prefix)
NEW_SECTIONS = [
    ('Streaks', 'src/resources/streaks.ts', 'streaks.'),
    ('Membership', 'src/resources/membership.ts', 'membership.'),
    ('Payments', 'src/resources/payments.ts', 'payments.'),
    ('Beats', 'src/resources/beats.ts', 'beats.'),
    ('Distro', 'src/resources/distro.ts', 'distro.'),
    ('Promote', 'src/resources/promote.ts', 'promote.'),
    ('Pages', 'src/resources/pages.ts', 'pages.'),
]

# (api.md heading, source file, accessor prefix, new method names, anchor row)
EXTENDED_SECTIONS = [
    (
        'Search', 'src/resources/search.ts', 'search.',
        {'createGroupingToken', 'listHashtagPosts', 'listPlaces', 'searchAlbums',
         'searchCommunities', 'searchTags', 'listSuggestions', 'listTags'},
        '- <code title="get /search/users">client.search.'
        '<a href="./src/resources/search.ts">searchUsers</a>({ ...params }) -> UserList</code>',
    ),
    (
        'Authorizations', 'src/resources/authorizations.ts', 'authorizations.',
        {'listTwoFactorMethods', 'createTwoFactorRequest', 'createToken',
         'retrieveExternalToken', 'logout'},
        '- <code title="post /authorizations">client.authorizations.'
        '<a href="./src/resources/authorizations.ts">createSessionKey</a>({ ...params }) '
        '-> AuthorizationCreateSessionKeyResponse</code>',
    ),
    (
        'Validation', 'src/resources/validation.ts', 'validation.',
        {'validateCommunity', 'validateDistro'},
        '- <code title="get /validation/{entityType}">client.validation.'
        '<a href="./src/resources/validation.ts">validate</a>(entityType, { ...params }) '
        '-> ValidationValidateResponse</code>',
    ),
    (
        'Passwords', 'src/resources/passwords.ts', 'passwords.',
        {'resetPassword'},
        '- <code title="delete /passwords">client.passwords.'
        '<a href="./src/resources/passwords.ts">sendRestoreEmail</a>({ ...params }) -> void</code>',
    ),
    (
        'Genres', 'src/resources/genres.ts', 'genres.',
        {'listTrendingPosts'},
        '- <code title="get /genres">client.genres.'
        '<a href="./src/resources/genres.ts">list</a>() -> GenreListResponse</code>',
    ),
    (
        'Videos', 'src/resources/videos.ts', 'videos.',
        {'listStickers', 'retrieve'},
        '- <code title="post /videos/{videoId}/posts">client.videos.'
        '<a href="./src/resources/videos.ts">createPost</a>(videoID, { ...params }) -> Post</code>',
    ),
    (
        'Collections', 'src/resources/collections/likes.ts', 'collections.likes.',
        {'listUsers'},
        '- <code title="delete /collections/{collectionId}/likes">client.collections.likes.'
        '<a href="./src/resources/collections/likes.ts">remove</a>(collectionID) -> void</code>',
    ),
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
    return re.sub(r'\$\{(\w+)\}', r'{\1}', template)


def parse_methods(path):
    """Return [(method, verb, api_path, args, return_type)] in source order."""
    src = io.open(os.path.join(REPO, path), encoding='utf-8').read()
    body = src[src.index('export class '):]

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

    # Idempotent: drop any sections a previous run appended.
    for title, _source, _accessor in NEW_SECTIONS:
        api = re.sub(r'\n# %s\n.*?(?=\n# |\Z)' % re.escape(title), '', api, flags=re.S)
    api = api.rstrip('\n')

    total = 0
    for title, source, accessor in NEW_SECTIONS:
        methods = parse_methods(source)
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

    # Extend existing sections in place: keep the block up to and including the anchor, then
    # re-append the full method list for the section so a re-run cannot duplicate rows.
    for title, source, accessor, new_methods, anchor in EXTENDED_SECTIONS:
        assert anchor in api, '%s anchor not found; api.md layout changed' % title
        methods = parse_methods(source)
        missing = new_methods - {m[0] for m in methods}
        assert not missing, '%s methods missing from source: %s' % (title, sorted(missing))
        # Replace everything from the anchor to the next heading with the full method list.
        replacement = '\n'.join(
            row(v, p, accessor, n, a, r, source) for n, v, p, a, r in methods
        )
        api = re.sub(
            re.escape(anchor) + r'\n.*?(?=\n#{1,2} |\Z)',
            replacement,
            api,
            count=1,
            flags=re.S,
        )
        total += len(methods)

    io.open(os.path.join(REPO, 'api.md'), 'w', encoding='utf-8').write(api + '\n')
    print('api.md: %d new/extended method rows' % total)


if __name__ == '__main__':
    main()
