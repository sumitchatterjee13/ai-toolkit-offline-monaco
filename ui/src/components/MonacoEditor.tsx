'use client';
/**
 * Drop-in replacement for `@monaco-editor/react` that loads Monaco from this
 * app instead of the jsDelivr CDN.
 *
 * The stock loader fetches `https://cdn.jsdelivr.net/npm/monaco-editor@x.y.z/min/vs`
 * at runtime, which fails on machines without internet access or behind a
 * strict firewall, leaving the advanced YAML editor blank. `scripts/copy-monaco.js`
 * (run by the `prebuild` / `predev` npm hooks) copies the identical files from
 * the `monaco-editor` package into `public/monaco/vs`, and this module points
 * the loader there. The AMD loader resolves its CSS, language files and the
 * editor web worker relative to that same path, so no other configuration is
 * needed.
 *
 * Always import the editor from here, never from `@monaco-editor/react`
 * directly, so the loader is configured before the first <Editor /> mounts.
 *
 * Override the path with NEXT_PUBLIC_MONACO_VS_PATH if the UI is served from a
 * sub-path, e.g. NEXT_PUBLIC_MONACO_VS_PATH=/toolkit/monaco/vs
 */
import Editor, { loader } from '@monaco-editor/react';

loader.config({
  paths: {
    vs: process.env.NEXT_PUBLIC_MONACO_VS_PATH || '/monaco/vs',
  },
});

export * from '@monaco-editor/react';
export default Editor;
