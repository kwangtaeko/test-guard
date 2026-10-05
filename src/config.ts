import picomatch from 'picomatch';
import {
  createTestFileMatcher,
  DEFAULT_TEST_PATTERNS,
  normalizePath,
  type TestFileDetector,
} from './paths.js';
import type { Language, Severity } from './types.js';

export const CONFIG_FILE = '.test-guard.json';

export interface Config {
  languages: Language[];
  include: string[]; // extra test file patterns, language by extension
  exclude: string[];
  rules: Record<string, Severity | 'off'>;
}

export class ConfigError extends Error {}

const LANGUAGES: Language[] = ['js', 'python', 'java'];
const RULE_LEVELS = ['error', 'warn', 'off'];

export function parseConfig(text: string | null): Config {
  const config: Config = {
    languages: [...LANGUAGES],
    include: [],
    exclude: [],
    rules: {},
  };
  if (text === null) return config;

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new ConfigError(`${CONFIG_FILE}: invalid JSON`);
  }
  if (!isObject(raw))
    throw new ConfigError(`${CONFIG_FILE}: expected an object`);

  if (raw.languages !== undefined) {
    const languages = stringArray(raw.languages, 'languages');
    for (const language of languages) {
      if (!LANGUAGES.includes(language as Language)) {
        throw new ConfigError(`${CONFIG_FILE}: unknown language "${language}"`);
      }
    }
    config.languages = languages as Language[];
  }
  if (raw.include !== undefined) {
    config.include = stringArray(raw.include, 'include');
  }
  if (raw.exclude !== undefined) {
    config.exclude = stringArray(raw.exclude, 'exclude');
  }
  if (raw.rules !== undefined) {
    if (!isObject(raw.rules)) {
      throw new ConfigError(`${CONFIG_FILE}: "rules" must be an object`);
    }
    for (const [id, level] of Object.entries(raw.rules)) {
      if (typeof level !== 'string' || !RULE_LEVELS.includes(level)) {
        throw new ConfigError(
          `${CONFIG_FILE}: rule ${id} must be "error", "warn" or "off"`,
        );
      }
      config.rules[id] = level as Severity | 'off';
    }
  }
  return config;
}

export function createDetector(config: Config): TestFileDetector {
  const patterns = {} as Record<Language, string[]>;
  for (const language of LANGUAGES) {
    patterns[language] = config.languages.includes(language)
      ? [
          ...DEFAULT_TEST_PATTERNS[language],
          ...config.include.filter((p) => patternLanguage(p) === language),
        ]
      : [];
  }
  const match = createTestFileMatcher(patterns);
  const excluded =
    config.exclude.length > 0
      ? picomatch(config.exclude, { dot: true })
      : () => false;
  return (path) => {
    const normalized = normalizePath(path);
    return excluded(normalized) ? null : match(normalized);
  };
}

function patternLanguage(pattern: string): Language {
  if (pattern.endsWith('.py')) return 'python';
  if (pattern.endsWith('.java')) return 'java';
  return 'js';
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown, key: string): string[] {
  if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
    throw new ConfigError(
      `${CONFIG_FILE}: "${key}" must be an array of strings`,
    );
  }
  return value;
}
