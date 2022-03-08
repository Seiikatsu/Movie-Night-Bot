import { Locale } from 'discord-api-types/v10';
import { singleton } from '../ioc';
import EnvironmentUtils from '../utils/EnvironmentUtils';
import { LocaleService, LocaleServiceSymbol } from './LocaleService';

@singleton(LocaleServiceSymbol)
class LocaleServiceImpl implements LocaleService {
	private readonly appLocale: Locale;

	constructor() {
		let appLocale;
		const envLocale = EnvironmentUtils.getAsString('LOCALE', true);
		const matchingLocale = Object.entries(Locale)
			.find((entry) => {
				const [_, value] = entry;
				return value === envLocale;
			});
		if (matchingLocale) {
			const [_, match] = matchingLocale;
			appLocale = match;
		} else {
			throw new Error(`Given locale ${envLocale} does not match any supported locale! ${Object.values(Locale)}`);
		}
		this.appLocale = appLocale;
	}

	getLocale(): Locale {
		return this.appLocale;
	}
}
