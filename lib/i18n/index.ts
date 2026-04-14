import { en } from './en';
import { ar } from './ar';

export type Language = 'en' | 'ar';
export type { Strings } from './en';

export const dictionaries = { en, ar };

export function getStrings(lang: Language) {
  return dictionaries[lang];
}
