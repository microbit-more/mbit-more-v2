# Release Guide

This guide explains how to release `mbit-more-v2`, including how the Stretch3 build is updated.

---

## Overview

- Releases are made with `npm version`, which builds the extension and records the version in the repository.
- The Stretch3 build is pinned by a **branch** named `stretch3`. Stretch3 checks out this branch when it deploys.
- `stretch3` only follows `master`. Update it by fast-forward only; never commit to it directly.

---

## Regular release

```bash
git checkout develop
npm test
npm version [major|minor|patch]
```

The `version` script (`scripts/version-build.mjs`) does the following:

1. Rewrites `const version = 'v2-...';` in `src/gui/lib/libraries/extensions/entry/index-stretch3.jsx` to `v2-<package.json version>`.
2. Builds the extension and copies it to `dist/<version>/`, then updates `dist/versions.json`.
3. Stages `dist` and `index-stretch3.jsx` (`git add`) so they are included in the version commit.

The script fails if the `const version = 'v2-...';` line is not found in `index-stretch3.jsx`.

---

## Stretch3

`src/gui/lib/libraries/extensions/entry/index-stretch3.jsx` is copied verbatim by `install-stretch3.sh` into Stretch3 (a fork of scratch-gui v3.6.18 with React 16 and react-intl 2).

The `stretch3` branch is consumed by the deploy workflow of [stretch3.github.io](https://github.com/stretch3/stretch3.github.io/blob/source/.github/workflows/deploy.yml) through `ref: stretch3` and `install-stretch3.sh`. `actions/checkout` resolves an unqualified ref to a branch first, so do not create a tag with the same name.

Stretch3 deploys only when its own `source` branch is pushed, so updating `stretch3` takes effect at the next Stretch3 deploy.

### Before updating the branch

- [ ] The release is merged into `master`.
- [ ] `deploy.yml` in stretch3.github.io has no extra patch steps for microbitMore. For example, a former `microbit-more/fix-entry.sh` patch existed; it would fail once the upstream file is fixed.
- [ ] The Stretch3 maintainers know about the change. Coordinate with them first.

### Updating the branch

Open a pull request from `master` to `stretch3` so that CI (`.github/workflows/test.yml`) runs the tests, then merge it as a fast-forward:

```bash
gh pr create --base stretch3 --head master --title "Release vX.Y.Z to Stretch3"
# after CI passes
git fetch origin
git push origin origin/master:refs/heads/stretch3
```

The push is rejected if it is not a fast-forward. Do not force-push `stretch3`.

### After updating the branch

- Check that the deploy workflow of stretch3.github.io succeeds.
- Open https://stretch3.champierre.com/ and check that the MicroBit More card shows the name with the version (e.g. `MicroBit More (v2-x.y.z)`) and the description, with no `undefined`.
