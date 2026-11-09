#!/usr/bin/env node
/**
 * Copies the prebuilt Monaco editor (node_modules/monaco-editor/min/vs) into
 * public/monaco/vs so the UI can serve it itself.
 *
 * `@monaco-editor/react` normally pulls Monaco from the jsDelivr CDN at
 * runtime. Behind a strict firewall that request is blocked and the
 * advanced YAML config editor never renders. Serving the exact same files
 * from this app's own origin makes the editor work fully offline.
 *
 * Runs automatically via the `prebuild` / `predev` npm hooks; safe to run by
 * hand with `node scripts/copy-monaco.js`. Re-copies only when the installed
 * monaco-editor version differs from the one already in public/.
 */
const fs = require('fs');
const path = require('path');

const uiRoot = path.resolve(__dirname, '..');
const pkgDir = path.join(uiRoot, 'node_modules', 'monaco-editor');
const src = path.join(pkgDir, 'min', 'vs');
const destRoot = path.join(uiRoot, 'public', 'monaco');
const dest = path.join(destRoot, 'vs');
const stampFile = path.join(destRoot, 'VERSION');

if (!fs.existsSync(src)) {
  console.error(
    `[copy-monaco] ${src} not found.\n` +
      '  The "monaco-editor" package is not installed. Run `npm install` in the ui/ folder first.',
  );
  process.exit(1);
}

const version = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')).version;
const existing = fs.existsSync(stampFile) ? fs.readFileSync(stampFile, 'utf8').trim() : null;

if (existing === version && fs.existsSync(path.join(dest, 'loader.js'))) {
  console.log(`[copy-monaco] public/monaco/vs already has monaco-editor ${version}, nothing to do.`);
  process.exit(0);
}

fs.rmSync(destRoot, { recursive: true, force: true });
fs.mkdirSync(destRoot, { recursive: true });
fs.cpSync(src, dest, { recursive: true });
fs.writeFileSync(stampFile, version + '\n');

console.log(`[copy-monaco] Copied monaco-editor ${version} -> ${path.relative(uiRoot, dest)}`);
