// Syntax trees for the analyzers (tree-sitter, ROADMAP §12.2 M11). The
// grammars are WASM files: next to the bundle in dist/, or in node_modules
// when running from source. They load once, when this module is first
// imported (about 8 ms); parsing is synchronous.
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Language as Grammar, Parser, type Tree } from 'web-tree-sitter';
import type { Language } from '../types.js';

const FILES: Record<Language | 'runtime', [string, string]> = {
  runtime: ['web-tree-sitter', 'web-tree-sitter.wasm'],
  // TSX parses JavaScript, JSX and TypeScript alike.
  js: ['tree-sitter-typescript', 'tree-sitter-tsx.wasm'],
  python: ['tree-sitter-python', 'tree-sitter-python.wasm'],
  java: ['tree-sitter-java', 'tree-sitter-java.wasm'],
};

function wasmPath(key: keyof typeof FILES): string {
  const [pkg, file] = FILES[key];
  const bundled = join(dirname(fileURLToPath(import.meta.url)), file);
  if (existsSync(bundled)) return bundled;
  return createRequire(import.meta.url).resolve(`${pkg}/${file}`);
}

let parsers: Record<Language, Parser> | null = null;
let loading: Promise<void> | null = null;

// Loads the runtime and the grammars once (about 20 ms).
export function initSyntax(): Promise<void> {
  loading ??= (async () => {
    await Parser.init({ locateFile: () => wasmPath('runtime') });
    const loaded = {} as Record<Language, Parser>;
    for (const language of ['js', 'python', 'java'] as const) {
      const parser = new Parser();
      parser.setLanguage(await Grammar.load(wasmPath(language)));
      loaded[language] = parser;
    }
    parsers = loaded;
  })();
  return loading;
}

export function parse(language: Language, source: string): Tree {
  if (!parsers) throw new Error('initSyntax() must run before parsing');
  const tree = parsers[language].parse(source);
  if (!tree) throw new Error(`could not parse ${language} source`);
  return tree;
}

await initSyntax();
