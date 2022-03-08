import { Locale } from 'discord-api-types/v10';

export interface LocaleService {
	getLocale(): Locale;
}

export const LocaleServiceSymbol = Symbol.for('LocaleService');
