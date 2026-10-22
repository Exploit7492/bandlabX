# Multi-stage build for bandlabX, an unofficial TypeScript client for the BandLab API.
#
# The SDK has no runtime dependencies, so the final image carries the compiled package only: no
# node_modules, no toolchain, no sources. `scripts/container-smoke` builds this and runs its default
# command; `.github/workflows/container.yml` publishes it to GHCR.

# --- build ---------------------------------------------------------------------------------------
# Pinned to the Debian image rather than Alpine: the toolchain is glibc-only, and the build runs
# here, not in the published image, so image size does not matter at this stage.
FROM node:24-bookworm-slim AS build

WORKDIR /build

# Yarn 1 reads yarn.lock; copy manifests first so the dependency layer caches across source edits.
COPY package.json yarn.lock ./

# `prepare` would run the build before src/ exists, so install with scripts off.
RUN yarn install --frozen-lockfile --ignore-scripts --non-interactive

COPY . .

RUN ./scripts/build

# --- runtime -------------------------------------------------------------------------------------
# Alpine is safe here even though the build stage needs glibc: the output is pure JavaScript with no
# native modules and no runtime dependencies, so nothing in the image links against glibc.
FROM node:24-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

# Only the compiled package. `scripts/build` writes the publishable tree to dist/, including a
# package.json whose export map points at the compiled files.
COPY --from=build /build/dist ./

# The default command: load the SDK from the image and assert a call reaches the right URL.
COPY --from=build /build/examples/container-smoke.js ./container-smoke.js
CMD ["node", "container-smoke.js"]
