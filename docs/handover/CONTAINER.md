# Container image — build, smoke, publish

Phase 5 leaf `5.a.i.zi` through `5.b.i.zo`. The image is defined by `Dockerfile` and
`.dockerignore` at the repo root, built by `.github/workflows/container.yml`, and published to GHCR
when that workflow runs on `main` or on a `v*` tag.

## What the image is

A runtime image for the compiled SDK. The SDK has **no runtime dependencies**, so the image carries
the built package and nothing else: no `node_modules`, no TypeScript toolchain, no sources, no
`tests/`, no `docs/`.

| Property        | Value                                                             |
| --------------- | ----------------------------------------------------------------- |
| Build stage     | `node:24-bookworm-slim` (glibc, so the toolchain runs)            |
| Runtime stage   | `node:24-alpine` (output is pure JS, nothing links against glibc) |
| Default command | `node container-smoke.js`                                         |
| Compressed size | ~250 MB (the Alpine base; the Debian-slim runtime was ~337 MB)    |
| Image path      | `ghcr.io/zapier-codes/bandlab-sdk-typescript`                     |

The image is **not** a server and **not** a CLI. It exists so the SDK can be run, and its default
command is a self-check that proves the built package loads and routes a request to the right URL.

## Build and run it yourself

```bash
docker build --tag bandlab-sdk:local .
docker run --rm bandlab-sdk:local
```

Expected output:

```
bandlab-sdk container smoke OK (17 exports)
  http://127.0.0.1:9/validation/user
  http://127.0.0.1:9/users/some-user
```

`scripts/container-smoke` wraps both steps and adds a check that the image has no `node_modules` and
no runtime dependencies:

```bash
./scripts/container-smoke                # build, run, verify
SKIP_BUILD=1 ./scripts/container-smoke   # run an image that already exists
IMAGE=bandlab-sdk:local ./scripts/container-smoke
```

The smoke check stubs `fetch`, so it makes **no network calls** and needs no credentials. It asserts
the URL that reaches `fetch`, the same way `tests/api-resources/**` does.

## Owner steps

Steps 1 and 2 are done: the workflow's own `GITHUB_TOKEN` was sufficient, and the package is public.
Steps 3 and 4 remain yours.

1. ~~Allow the workflow to publish.~~ **Done — no action needed.** The workflow's own `GITHUB_TOKEN`
   carried `packages: write`, so no PAT and no repository setting was required.

2. ~~Make the package pullable.~~ **Done — the package is public.** Anonymous pulls succeed
   (verified by fetching a registry token with no credentials and reading all three manifests).

3. **Decide whether `main` should publish `latest` on every merge** (leaf `5.b.ii.zi` is otherwise
   complete). The workflow currently does. If you would rather publish only on version tags, remove
   the `push: branches: [main]` trigger from `container.yml`; the
   `type=raw,value=latest,enable={{is_default_branch}}` tag rule then applies only to tag builds.

4. **Optional:** add a `README` description or link on the package page under the org's **Packages**
   tab, so the image is discoverable from GHCR.

## What is verified, and what is not

Verified on 2026-10-15, in the sandbox, with a real Docker daemon:

| Check                                      | Result                                                     |
| ------------------------------------------ | ---------------------------------------------------------- |
| `docker build`                             | succeeds (both stages, ~4 s of build after install)        |
| `docker run --rm bandlab-sdk:smoke`        | exit 0, prints the two URLs above                          |
| `SKIP_BUILD=1 ./scripts/container-smoke`   | exit 0, "image is clean"                                   |
| Image contains no `node_modules`           | confirmed by the smoke script                              |
| Runtime dependencies in the image          | none                                                       |
| `container.yml` parses as YAML             | confirmed                                                  |
| CI run `38781546855` on `main`             | all 10 steps success, including `Publish to GHCR`          |
| Published tags                             | `latest`, `main`, `sha-4b7382e…`                           |
| Anonymous registry pull of all three tags  | HTTP 200 (public)                                          |
| `docker pull ghcr.io/…:latest` then run it | exit 0, `container smoke OK (17 exports)`, both URLs match |

The image is published and publicly pullable. `docker run` against the pulled image reproduces the
smoke output byte for byte, so leaf `5.b.ii.zi`'s "pulls and runs" criterion is met.

## Files

| File                              | Purpose                                                     |
| --------------------------------- | ----------------------------------------------------------- |
| `Dockerfile`                      | Multi-stage build; build stage compiles, runtime stage runs |
| `.dockerignore`                   | Keeps the context small and keeps captures out of the image |
| `scripts/container-smoke`         | Builds, runs the default command, asserts the image is lean |
| `examples/container-smoke.js`     | The default command; loads the SDK and checks two URLs      |
| `.github/workflows/container.yml` | Build on every change, publish on `main` and `v*` tags      |
