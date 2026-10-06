// Non-test files the engine reads: test runner configs (TG005) and files that
// keep test-guard itself in place (TG006).
import picomatch from 'picomatch';
import { CONFIG_FILE } from './config.js';
import { normalizePath } from './paths.js';

export type RunnerConfig =
  | 'package.json'
  | 'jest'
  | 'vitest'
  | 'vite'
  | 'mocha'
  | 'pytest'
  | 'conftest'
  | 'maven'
  | 'gradle'
  | 'workflow';

export function runnerConfigKind(path: string): RunnerConfig | null {
  const normalized = normalizePath(path);
  if (/^\.github\/workflows\/[^/]+\.ya?ml$/.test(normalized)) return 'workflow';
  const name = normalized.split('/').pop() ?? '';
  if (name === 'package.json') return 'package.json';
  if (/^jest\.config\.(?:[cm]?[jt]s|json)$/.test(name)) return 'jest';
  if (/^vitest\.(?:config|workspace)\.[cm]?[jt]s$/.test(name)) {
    return 'vitest';
  }
  if (/^vite\.config\.[cm]?[jt]s$/.test(name)) return 'vite';
  if (/^\.mocharc(?:\.\w+)?$/.test(name)) return 'mocha';
  if (['pytest.ini', 'pyproject.toml', 'setup.cfg', 'tox.ini'].includes(name)) {
    return 'pytest';
  }
  if (name === 'conftest.py') return 'conftest';
  if (name === 'pom.xml') return 'maven';
  if (/^build\.gradle(?:\.kts)?$/.test(name)) return 'gradle';
  return null;
}

// Files that run test-guard (git hooks, CI, agent hooks). Anchored at the
// repository root.
const isHookFile = picomatch(
  [
    '.husky/**',
    '{.,}lefthook{,-local}.{yml,yaml}',
    '.pre-commit-config.yaml',
    '.github/workflows/*.{yml,yaml}',
    '.claude/settings{,.local}.json',
    '.codex/**',
    'package.json',
  ],
  { dot: true },
);

export function guardFileKind(path: string): 'config' | 'hook' | null {
  const normalized = normalizePath(path);
  if (normalized === CONFIG_FILE) return 'config';
  return isHookFile(normalized) ? 'hook' : null;
}

// Jest/Vitest snapshot files (TG008).
export const isSnapshot = (path: string) => /\.snap$/.test(path);
