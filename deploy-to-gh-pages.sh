#!/bin/sh
set -e

# Build the static site (dist-pages/ is gitignored) then force-push its
# contents to the gh-pages branch on origin. Only the wasm glowfish engine
# works on the static deploy; sf* opponents need the local WebSocket backend.

REMOTE_URL=$(git config --get remote.origin.url)
OUT=dist-pages

npm run build:pages

cd "$OUT"
git init -q
git checkout -q -b gh-pages
touch .nojekyll
git add -A
git -c user.name=deploy -c user.email=deploy@local \
  commit -q -m "deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -f "$REMOTE_URL" gh-pages
cd ..
rm -rf "$OUT/.git"
