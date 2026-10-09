import { tg001 } from './tg001.js';
import { tg002 } from './tg002.js';
import { tg003 } from './tg003.js';
import { tg004 } from './tg004.js';
import { tg005 } from './tg005.js';
import { tg006 } from './tg006.js';
import { tg007 } from './tg007.js';
import { tg008 } from './tg008.js';
import { tg009 } from './tg009.js';
import type { Rule } from './types.js';

export const RULE_IDS = [
  'TG001',
  'TG002',
  'TG003',
  'TG004',
  'TG005',
  'TG006',
  'TG007',
  'TG008',
  'TG009',
] as const;

export type RuleId = (typeof RULE_IDS)[number];

export const RULES: Record<RuleId, Rule> = {
  TG001: tg001,
  TG002: tg002,
  TG003: tg003,
  TG004: tg004,
  TG005: tg005,
  TG006: tg006,
  TG007: tg007,
  TG008: tg008,
  TG009: tg009,
};

export function isRuleId(id: string): id is RuleId {
  return (RULE_IDS as readonly string[]).includes(id);
}
