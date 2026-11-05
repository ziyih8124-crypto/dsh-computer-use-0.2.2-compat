# DSH 0.2.2-rc.1 compatibility build

This repository packages **`@anionex/dsh-computer-use@0.3.7`** with the minimum
metadata change needed to load on **DeepSeek Harness 0.2.2-rc.1** (macOS).

## Why

DSH rejects a plugin when its exact prerelease peer versions do not include the
running release. Upstream 0.3.7 declares compatibility only up to
`0.2.1-rc.3`, so a 0.2.2-rc.1 profile reports:

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

## Optional: allow all apps

The plugin's default policy is an explicit per-app allowlist. To let it read and
control every running app, add this to the DSH profile patch
(`~/.dsh/profiles/<profile>/cordis.patch.yml`):

```yaml
- id: computer-use
  name: "@anionex/dsh-computer-use"
  config:
    allowAllApps: true
```

`allowAllApps: true` makes exact grants redundant. Sensitive actions still use
the plugin's just-in-time confirmation flow; with approval prompts disabled,
those actions are blocked rather than silently executed.

## Verified

On macOS 26.6.2, DSH 0.2.2-rc.1, 2026-11-06:

- `plugin_manager list_bundles` -> `version 0.3.7`, `enabled: true`, no error;
- the `computer-use` / `dsh-computer-use` Skills and 11 tools are registered;
- `computer_observe` on Finder succeeds (with `allowAllApps: true`);
- Finder keyboard control works (`Cmd+N` opened a new Finder window);
- Finder menu-bar click works (AXPress opened the "文件" menu);
- DSH's Chromium content is exposed through AX (0.3.5+ AXManualAccessibility).

Known edge case: clicking inside a transient Finder window can fail with
`the target window has no stable window id`; menu-bar actions and keyboard input
are unaffected. This is a window-identity limitation, not a permission issue.

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
