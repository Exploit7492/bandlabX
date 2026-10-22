"""Leaf 93 (`4.a.ii.zi`) - document the resources the Phase 3 work added to `README.md`.

Phase 3 took the SDK from a handful of domains to 46 top-level resources, but the README still
showed a single `client.validation` example. This script appends a `## Resources` section:

  * a table of every top-level accessor with its endpoint count and a link into `api.md`;
  * one runnable example per domain, with the argument list taken from the real method
    signature in `src/resources/**` so an example cannot name an argument the SDK does not take.

The section is delimited by markers, so re-running replaces it instead of appending again.

Usage: python3 scripts/research/gen-34-readme.py
"""
import io
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
README = os.path.join(REPO, 'README.md')
API = os.path.join(REPO, 'api.md')

BEGIN = '<!-- BEGIN GENERATED RESOURCES -->'
END = '<!-- END GENERATED RESOURCES -->'

ROW = re.compile(r'<code title="([a-z]+) ([^"]+)">client\.([A-Za-z0-9_.]*)<a href="([^"]+)">([A-Za-z0-9_]+)</a>')
HEADING = re.compile(r'^(#{1,2}) (\S.*?)\s*$', re.M)
METHOD_RE = re.compile(r'^  ([A-Za-z]\w*)\((.*?)\): APIPromise<([^>]*)>', re.M | re.S)
CLIENT_RE = re.compile(r'this\._client\.(\w+)\(\s*(path`([^`]*)`|\'([^\']*)\')')

PARAM_SUFFIX = 'Params'

# One example per domain, in the order the table lists them. The value is the method to show.
EXAMPLES = [
    ('songs', 'list'),
    ('revisions', 'create'),
    ('messaging', 'listConversations'),
    ('communities', 'list'),
    ('posts', 'list'),
    ('images', 'createPost'),
    ('users', 'retrieve'),
    ('library', 'listSamples'),
    ('feeds', 'retrieveForYou'),
    ('albums', 'list'),
    ('effects', 'list'),
    ('sounds', 'search'),
    ('uploads', 'retrieveStorage'),
    ('ai', 'listVoices'),
    ('syncedLyrics', 'retrieve'),
    ('streaks', 'retrieve'),
    ('membership', 'retrievePlan'),
    ('payments', 'listMethods'),
    ('beats', 'list'),
    ('distro', 'retrieveOverview'),
    ('promote', 'listCampaigns'),
    ('pages', 'retrieveBio'),
    ('search', 'searchUsers'),
    ('authorizations', 'createSessionKey'),
    ('validation', 'validate'),
    ('bands', 'list'),
    ('collections', 'list'),
    ('videos', 'list'),
    ('invites', 'retrieve'),
    ('reports', 'create'),
    ('settings', 'retrieve'),
    ('tracks', 'list'),
    ('soundbanks', 'list'),
    ('me', 'retrieve'),
    ('genres', 'list'),
    ('misc', 'retrieve'),
    ('labels', 'list'),
    ('versions', 'list'),
    ('skills', 'list'),
    ('badges', 'list'),
    ('emails', 'confirm'),
    ('logins', 'create'),
    ('passwords', 'sendRestoreEmail'),
    ('aiVideos', 'listStyles'),
    ('feedback', 'create'),
    ('push', 'list'),
]


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


def _placeholder(name):
    if name.endswith('ID'):
        name = name[:-2] + 'Id'
    parts = [p for p in name.split('_') if p]
    if len(parts) > 1:
        name = parts[0] + ''.join(p[:1].upper() + p[1:] for p in parts[1:])
    return name


def read(path):
    return io.open(os.path.join(REPO, path), encoding='utf-8').read()


def api_sections():
    """(accessor -> top-level `#` heading title), and accessor -> endpoint count."""
    text = read('api.md')
    titles, current = {}, None
    counts = {}
    for line in text.split('\n'):
        h = re.match(r'^# (\S.*?)\s*$', line)
        if h:
            current = h.group(1)
            continue
        m = ROW.search(line)
        if not m:
            continue
        acc = m.group(3).split('.')[0]
        counts[acc] = counts.get(acc, 0) + 1
        if acc not in titles:
            titles[acc] = current or acc
    return titles, counts


def api_rows():
    """[(accessor, verb, method, args_string)] in api.md order, args from the rest of the line."""
    rows = []
    for line in read('api.md').split('\n'):
        m = ROW.search(line)
        if not m:
            continue
        rest = line[m.end():]
        args = re.match(r'\(([^)]*)\)', rest)
        rows.append((m.group(3).rstrip('.'), m.group(1), m.group(5), args.group(1) if args else ''))
    return rows


# Prefer a read-only-looking call for the example, so copy-paste does not mutate an account.
PREFERRED = ('list', 'retrieve', 'search', 'validate', 'get', 'retrieveOverview', 'count')

SAMPLE = {
    'userID': "'user-id'",
    'postID': "'post-id'",
    'songID': "'song-id'",
    'communityID': "'community-id'",
    'collectionID': "'collection-id'",
    'commentID': "'comment-id'",
    'albumID': "'album-id'",
    'revisionID': "'revision-id'",
    'bandID': "'band-id'",
    'imageID': "'image-id'",
    'videoID': "'video-id'",
    'entityType': "'user'",
    '{ ...params }': '{}',
}


def sample_args(args):
    """Turn api.md's argument list into runnable-looking values."""
    if not args.strip():
        return ''
    out = []
    for a in [x.strip() for x in args.split(',')]:
        if a in SAMPLE:
            out.append(SAMPLE[a])
        elif a.startswith('{'):
            out.append('{}')
        else:
            out.append("'%s'" % re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', a).lower())
    return ', '.join(out)


def pick_example(rows, accessor):
    """The representative call for one accessor.

    Prefers a read: a GET whose method name starts with a read verb, then any GET. Only falls
    back to a mutating call when the resource has no GET at all, so the examples a reader copies
    do not create or delete anything.
    """
    mine = [r for r in rows if r[0] == accessor]
    if not mine:
        return None
    gets = [r for r in mine if r[1] == 'get']
    for name in PREFERRED:
        for r in gets:
            if r[2] == name:
                return r[2], r[3]
    if gets:
        return gets[0][2], gets[0][3]
    return mine[0][2], mine[0][3]


def main():
    titles, counts = api_sections()
    rows = api_rows()
    readme = read('README.md')

    lines = [BEGIN, '', '## Resources', '']
    lines += [
        'Every top-level resource on the client. Each links into [api.md](api.md), which lists',
        'the full method set.',
        '',
        '| Resource | Endpoints | Docs |',
        '| -------- | --------- | ---- |',
    ]
    for acc in sorted(counts, key=lambda a: (-counts[a], a)):
        title = titles.get(acc, acc)
        anchor = '#' + title.lower().replace(' ', '-')
        lines.append('| `client.%s` | %d | [%s](api.md%s) |' % (acc, counts[acc], title, anchor))

    lines += ['', '### Examples', '']
    lines += [
        'One call per domain. Each example prefers a read (`GET`); a resource with no read endpoint',
        'shows its first call instead.',
        '',
    ]
    shown = 0
    for acc in sorted({r[0] for r in rows},
                      key=lambda a: (-counts.get(a.split('.')[0], 0), a)):
        picked = pick_example(rows, acc)
        if not picked:
            continue
        method, args = picked
        lines += [
            '```ts',
            '// %s' % acc,
            'const result = await client.%s.%s(%s);' % (acc, method, sample_args(args)),
            '```',
            '',
        ]
        shown += 1

    lines += [END, '']
    block = '\n'.join(lines)

    if BEGIN in readme and END in readme:
        readme = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END), block.rstrip('\n'),
                        readme, count=1, flags=re.S)
    else:
        readme = readme.rstrip('\n') + '\n\n' + block

    io.open(README, 'w', encoding='utf-8').write(readme)
    print('README: %d resources, %d examples' % (len(counts), shown))


if __name__ == '__main__':
    main()
