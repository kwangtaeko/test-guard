import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { cli: 'src/bin.ts' },
  format: ['esm'],
  target: 'node20',
  clean: true,
  // One self-contained file: plugin installs from npm get no dependencies.
  noExternal: [/.*/],
  // Bundled CommonJS packages (commander, picomatch) require Node built-ins.
  banner: {
    js: "import { createRequire } from 'node:module';\nconst require = createRequire(import.meta.url);",
  },
});
