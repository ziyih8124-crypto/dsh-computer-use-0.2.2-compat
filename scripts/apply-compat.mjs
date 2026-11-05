#!/usr/bin/env node
/**
 * Re-apply the DSH 0.2.2-rc.1 compatibility patch to
 * @anionex/dsh-computer-use after a pnpm install/reinstall.
 *
 * Usage:
 *   node apply-compat.mjs [plugin-package.json] [runtime-version]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const target = process.argv[2] || path.join(
  os.homedir(),
  ".dsh/profiles/desktop/node_modules/@anionex/dsh-computer-use/package.json"
);
const runtime = process.argv[3] || "0.2.2-rc.1";
const pkg = JSON.parse(fs.readFileSync(target, "utf8"));

let patched = 0;
for (const name of Object.keys(pkg.peerDependencies || {})) {
  if (!name.startsWith("@deepseek-ai/dsh-")) continue;
  const range = pkg.peerDependencies[name];
  if (!range.includes(runtime)) {
    pkg.peerDependencies[name] = `${range} || ${runtime}`;
    patched++;
  }
}
const compat = pkg.dsh?.compatibility;
if (compat) {
  if (!compat.dsh.includes(runtime)) compat.dsh = `${compat.dsh} || ${runtime}`;
  compat.dshReleases = compat.dshReleases || {};
  compat.dshReleases[runtime] = "compatible";
}
fs.writeFileSync(target, JSON.stringify(pkg, null, 2) + "\n");
console.log(`patched ${patched} peer ranges for DSH ${runtime}`);
console.log(target);
