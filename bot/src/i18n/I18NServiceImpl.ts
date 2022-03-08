import { inject } from 'inversify';
import { singleton } from '../ioc';
import { LocaleService, LocaleServiceSymbol } from '../locale';
import { I18NService, I18NServiceSymbol } from './I18NService';
import localeMap from './translationMap';

@singleton(I18NServiceSymbol)
class I18NServiceImpl implements I18NService {
	constructor(@inject(LocaleServiceSymbol) private readonly localeService: LocaleService) {
	}

	translate(key: string, ...parameters: string[]): string {
		const appLocale = this.localeService.getLocale();
		const textMap = localeMap[appLocale];
		if (textMap !== undefined) {
			const translatedText = textMap[key];
			if (translatedText !== undefined) {
				return I18NServiceImpl.fillParameters(translatedText, parameters);
			}
			console.warn(`Text ${key} not translated for locale ${appLocale}`);
			return ' ';
		}
		console.warn(`Cannot find text atlas for locale ${appLocale}`);
		return ' ';
	}

	private static fillParameters(text: string, parameters?: string[]): string {
		if (!parameters || parameters.length === 0) {
			return text;
		}

		let formattedText = text;
		for (let idx = 0; idx < parameters.length; idx += 1) {
			const param = parameters[idx];
			formattedText = formattedText.replace(`{${idx}}`, param);
		}
		return formattedText;
	}
}
