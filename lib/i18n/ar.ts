// Arabic surface is DORMANT for the English-only launch (0003 §5). The AR route
// is redirected to `/` and the language toggle is removed, so this dictionary is
// never rendered. It mirrors the English dictionary purely so the shared i18n
// scaffolding keeps type-checking; real Arabic copy is reintroduced later when
// the UAE surface goes live. Do not invest in AR translation now.
import { en } from './en';
import type { Strings } from './en';

export const ar: Strings = en;
