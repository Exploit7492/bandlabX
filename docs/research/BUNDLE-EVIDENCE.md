# Bundle Evidence — what the live BandLab web app calls

Recorded by a session on 2026-10-15. This is **evidence**, in the sense of rule D6
(`HANDOVER.md` section 2): every path here appears verbatim in BandLab's own shipped client.
Nothing in this file is guessed, inferred from a naming convention, or fabricated.

## 1. Sources

| Source | What it is | Size / count |
|--------|-----------|--------------|
| `https://www.bandlab.com/web-app/scripts/CYjIzzub.js` | the web app main bundle | 1,947,947 bytes |
| `https://www.bandlab.com/web-app/scripts/<name>.js` | 217 lazy-loaded chunks imported by the main bundle | ~1.7 MB total |
| `openapi_spec_url` from `.stats.yml` | the OpenAPI spec the SDK was generated from | 6,752 lines, 55 paths, 123 operations |

The spec was fetched from the URL already recorded in `.stats.yml`. Its `servers:` block is:

```yaml
servers:
  - url: 'https://test.bandlab.com/api/v1.3'   # Test environment
  - url: 'https://bandlab.com/api/v1.3'        # Production environment
```

This **settles P0** (the open base-host question in `HANDOVER.md` section 1a). The SDK's
`environments.production` default of `https://test.bandlab.com/api/v1.3` matches the spec's
first server. The owner may still prefer to make `bandlab.com` the default; that is a
product decision, not an evidence gap.

## 2. The finding that changes the plan

The spec is **not** a superset of what BandLab exposes. It is a narrow subset:

| Set | Distinct path templates | Operations |
|-----|------------------------|-----------|
| OpenAPI spec (and therefore the SDK) | 80 | 123 |
| Web app bundle | 236 | 145 method+path pairs found, 225 clean paths |
| **Union (everything to implement)** | — | **201 new + 123 existing** |

The spec contains **no** messaging, no effects, no sounds, no uploads. Those capabilities exist
in the product and in the app bundle, but were never in the generated spec. That is exactly why
`COVERAGE.md` could not find them and why Phase 3 was blocked: it was looking for evidence in a
document that does not describe them.

The earlier assumption in `HANDOVER.md` section 1a — that evidence must come from the owner as
scrubbed HAR captures — **was wrong**. The evidence was publicly fetchable from BandLab's own
web app the whole time.

## 3. Verification status per endpoint

Two independent checks were run.

**Check A — present in the shipped bundle.** Every path below passed this. This is the primary
evidence and it is strong: the app calls these paths in production.

**Check B — live unauthenticated probe against `test.bandlab.com`.** A representative sample of
53 endpoints was probed. Results:

| Probe result | Count | Meaning |
|---|---|---|
| 401 | 19 | route exists, needs a bearer token |
| 200 | 7 | route exists and answers anonymously |
| 400 / 403 | 3 | route exists, rejected the empty request |
| 204 | 1 | route exists, no content |
| 500 | 2 | ambiguous (server error, route unclear) |
| 404 | 24 | **inconclusive — not evidence of absence** |

**The 404s must not be read as "does not exist".** This was proven directly: endpoints that are
definitely real and definitely in the spec — `/badges`, `/validation`, `/reports`, `/bands/{id}` —
also return 404 unauthenticated. So 404 carries no information here. The `v2.0` uploads, `v3.0`
sounds and `v4.3` soundbanks routes are called by the mobile/studio client and do not resolve
from the web host at all.

Confirmed to exist by probe (non-404): `/users/{id}/conversations`, `/conversations/{id}/members`,
`/chat/authorizations`, `/effect-presets/{id}`, `/trending-effect-presets`,
`/users/{id}/effect-presets`, `/revisions/{id}/mixdown/reprocess`,
`/revisions/{id}/tracks/{id}/download-options/{id}`, `/songs/{id}/invite-link`,
`/mentions/suggestions`, `/search/collaborators`, `/users/{id}/membership`,
`/users/{id}/profile-pictures`, `/users/{id}/track-posts`, `/users/{id}/feeds/for-you/posts`,
`/genres/{id}/posts/trending`, `/users/{id}/playing-now`, `/users/{id}/profile-views/counter`,
`/users/{id}/pages`, `/users/{id}/settings/privacy/{id}`, `/beats`, `/beats/collections`,
`/opportunities`, `/places`, `/preview`.

## 4. What is still NOT evidenced

Stated plainly, so no later session overclaims:

| Gap | Status | Why |
|-----|--------|-----|
| **Request/response shapes for the 201 new endpoints** | **NOT evidenced** | Source maps are 404 (`CYjIzzub.js.map`), so the bundle yields no type information. Paths are known; payloads are not. |
| **HTTP method per endpoint** | **partially evidenced** | 145 method+path pairs were recovered from call sites (77 GET, 35 POST, 16 DELETE, 10 PUT, 7 PATCH). The rest are path-only. |
| **Auth model** | known | `Authorization: Bearer <JWT>`, per the spec's `securitySchemes`. |
| **Live behaviour with a token** | **NOT evidenced** | No authenticated request was made, and none should be. |

**Consequence for Phase 3:** implementing a *path* is now unblocked. Implementing a *typed
request and response body* is still blocked for most new endpoints, because no shape evidence
exists. A session must not invent those shapes (D6).

## 5. Recommended way to close the remaining shape gap

Three routes, in order of strength:

1. **Authenticated capture** by the owner, using `docs/research/CAPTURE-GUIDE.md` and
   `scripts/research/scrub-har.py` as already built. The 201 paths now make the capture list
   precise instead of speculative: each row can name the exact path to exercise.
2. **A token supplied at runtime by the owner** to a script the session writes, run from the
   owner's own machine — never a credential pasted into a chat.
3. **Untyped first pass.** Add the methods with `unknown`-typed bodies and a JSDoc status of
   `unverified`, then tighten types when shapes arrive in Phase 4 (`4.a.i.zi` already exists
   for this). This is honest, ships working paths, and does not violate D6 because nothing is
   asserted about the shape.

Route 3 is the only one that needs no further input from the owner.

## 6. Files produced

| File | Contents |
|------|----------|
| `docs/research/bundle-endpoints.md` | all 225 clean paths, grouped by top-level segment, each flagged SDK/NEW with its probe result |
| `docs/research/BUNDLE-EVIDENCE.md` | this file: method, sources, verification status, remaining gaps |

Extraction was mechanical: regex over the bundle and chunks for `/api/v<version>/...`, template
parameters normalised to `{p}`, malformed extractions discarded. No path was typed by hand.
