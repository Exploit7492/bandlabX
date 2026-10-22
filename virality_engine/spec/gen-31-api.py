"""Append the Phase 3.1 (leaves 15-40) resource sections to api.md.

Signatures are parsed straight out of `src/resources/**` so `api.md` cannot drift from the code.
Existing sections are left byte-identical; only the Bands block is extended in place.
Run `./scripts/coverage` afterwards to re-derive the inventory and check for drift.
"""
import io
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# (api.md heading, source file, resource accessor prefix)
SECTIONS = [
    ('Albums', 'src/resources/albums.ts', 'albums.'),
    ('Effects', 'src/resources/effects.ts', 'effects.'),
    ('Sounds', 'src/resources/sounds/sounds.ts', 'sounds.'),
    ('Uploads', 'src/resources/uploads.ts', 'uploads.'),
    ('Soundbanks', 'src/resources/soundbanks.ts', 'soundbanks.'),
    ('AI', 'src/resources/ai/ai.ts', 'ai.'),
    ('AI Videos', 'src/resources/ai-videos.ts', 'aiVideos.'),
    ('Synced Lyrics', 'src/resources/synced-lyrics.ts', 'syncedLyrics.'),
    ('Misc', 'src/resources/misc.ts', 'misc.'),
    ('Tracks', 'src/resources/tracks.ts', 'tracks.'),
]

BANDS_SOURCE = 'src/resources/bands/bands.ts'
BANDS_NEW = {
    'listSuggested', 'listFollowers', 'addFollower',
    'listMemberFollowInvitees', 'pinPost', 'listVideoPosts',
}

METHOD_RE = re.compile(r'^  ([A-Za-z]\w*)\((.*?)\): APIPromise<([^>]*)>', re.M | re.S)
CLIENT_RE = re.compile(r'this\._client\.(\w+)\(\s*(path`([^`]*)`|\'([^\']*)\')')

PARAM_SUFFIX = 'Params'


def _split_params(raw):
    """Split a parameter list on top-level commas."""
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
    """Turn `path`/x/${id}`` into the api.md `/x/{id}` form."""
    return re.sub(r'\$\{(\w+)\}', r'{\1}', template)


def parse_methods(path):
    """Return [(method, verb, api_path, signature, return_type)] in source order."""
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
    """Top-level interfaces the resource file exports, in declaration order."""
    src = io.open(os.path.join(REPO, path), encoding='utf-8').read()
    names = re.findall(r'^export interface (\w+)', src, re.M)
    return [n for n in names if not n.endswith(PARAM_SUFFIX)]


def row(verb, api_path, accessor, method, args, ret, source):
    call = '%s(%s)' % (method, args) if args else '%s()' % method
    return ('- <code title="%s %s">client.%s<a href="./%s">%s</a>%s -> %s</code>'
            % (verb.lower(), api_path, accessor, source, method,
               ('(%s)' % args) if args else '()', ret))


def main():
    api = io.open(os.path.join(REPO, 'api.md'), encoding='utf-8').read().rstrip('\n')

    # Idempotent: drop any sections a previous run appended so a re-run cannot duplicate rows.
    for title, _source, _accessor in SECTIONS:
        api = re.sub(r'\n# %s\n.*?(?=\n# |\Z)' % re.escape(title), '', api, flags=re.S)
    api = api.rstrip('\n')

    anchor = ('- <code title="get /bands/{bandId}/songs">client.bands.'
              '<a href="./src/resources/bands/bands.ts">listSongs</a>(bandID, { ...params }) -> SongList</code>')
    assert anchor in api, 'Bands anchor not found; api.md layout changed'
    bands = [m for m in parse_methods(BANDS_SOURCE) if m[0] in BANDS_NEW]
    missing = BANDS_NEW - {m[0] for m in bands}
    assert not missing, 'bands methods missing from source: %s' % sorted(missing)
    bands_types = [t for t in types_for(BANDS_SOURCE) if t in ('SuggestedBand', 'SuggestedBandList')]
    assert bands_types, 'no Suggested* types found in bands source'
    # Drop the block a previous run appended after the anchor, keeping the anchor itself.
    # Stop at the next `##`/`#` heading so the sibling `## Members`/`## Invites` blocks survive.
    api = re.sub(re.escape(anchor) + r'\n.*?(?=\n#{1,2} |\Z)', anchor, api, count=1, flags=re.S)
    block = [anchor, '', 'Types:', '']
    block += ['- <code><a href="./src/resources/bands/bands.ts">%s</a></code>' % t for t in bands_types]
    block += ['', 'Methods:', '']
    block += [row(v, p, 'bands.', n, a, r, 'src/resources/bands/bands.ts')
              for n, v, p, a, r in bands]
    api = api.replace(anchor, '\n'.join(block), 1)

    total = 0
    for title, source, accessor in SECTIONS:
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

    io.open(os.path.join(REPO, 'api.md'), 'w', encoding='utf-8').write(api + '\n')
    print('api.md: added %d new method rows' % total)


if __name__ == '__main__':
    main()
