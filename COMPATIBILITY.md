# DSH 0.2.2-rc.1 compatibility patch

This repository packages `@anionex/dsh-computer-use@0.3.4` with the minimum
metadata change needed to load on **DeepSeek Harness 0.2.2-rc.1** (macOS).

## Why

DSH rejects a plugin when its exact prerelease peer versions do not include the
running release. Upstream 0.3.4 declares compatibility only up to
`0.2.1-rc.2`, so the profile reports:

```
incompatible-version ... runtimeVersion: 0.2.2-rc.1
```

and the bundle is disabled / dropped from the profile.

## Change

Only `package.json` is modified:

- every `@deepseek-ai/dsh-*` peer range gets `|| 0.2.2-rc.1`;
- `dsh.compatibility.dsh` gets `|| 0.2.2-rc.1`;
- `dsh.compatibility.dshReleases["0.2.2-rc.1"] = "compatible"`.

No version exemption is used.

## Verified

On macOS 26.6.2, DSH 0.2.2-rc.1:

- `plugin_manager list_bundles` -> `enabled: true`, row `computer-use`, no error;
- 11 computer-use tools registered (`computer_observe`, `computer_click`, ...);
- `computer_list_apps` succeeded; Accessibility and Screen Recording `granted`.

## Install / apply

The patch is meant for an already-installed npm package in the DSH profile:

```sh
node scripts/apply-compat.mjs
```

Then enable `@anionex/dsh-computer-use` in DSH's plugin manager (or
`plugin_manager set_bundle`).

A pnpm reinstall or plugin upgrade overwrites `package.json`; re-run the script
afterwards.

## Caveats

- This is a declaration-level compatibility patch. It was verified on
  0.2.2-rc.1, but it is not an upstream release.
- If upstream publishes a version that natively supports 0.2.2-rc.1, prefer it.
- Upstream license and copyright are preserved in `LICENSE` and `NOTICE`.
