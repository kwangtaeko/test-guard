import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { defineConfig } from 'tsup';

// Tree-sitter's runtime and grammars ship as WASM files next to the bundle.
const WASM = [
  'web-tree-sitter/web-tree-sitter.wasm',
  'tree-sitter-typescript/tree-sitter-tsx.wasm',
  'tree-sitter-python/tree-sitter-python.wasm',
  'tree-sitter-java/tree-sitter-java.wasm',
];

// A function so the copy follows `outDir` (the hook e2e test builds elsewhere).
export default defineConfig((options) => ({
  entry: { cli: 'src/bin.ts' },
  format: ['esm'],
  target: 'node20',
  clean: true,
  // Self-contained: plugin installs from npm get no dependencies.
  noExternal: [/.*/],
  // Bundled CommonJS packages (commander, picomatch) require Node built-ins.
  banner: {
    // Aliased: web-tree-sitter imports `createRequire` itself.
    js: "import { createRequire as tgCreateRequire } from 'node:module';\nconst require = tgCreateRequire(import.meta.url);",
  },
  onSuccess: async () => {
    const outDir = options.outDir ?? 'dist';
    const require = createRequire(import.meta.url);
    mkdirSync(outDir, { recursive: true });
    for (const file of WASM) {
      copyFileSync(
        require.resolve(file),
        join(outDir, file.split('/').pop() ?? ''),
      );
    }
  },
}));
