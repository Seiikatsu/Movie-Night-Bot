import { inject } from 'inversify';
import { DateTime, Duration } from 'luxon';
import { singleton } from '../ioc';
import { LocaleService, LocaleServiceSymbol } from '../locale';
import Formatter from '../utils/Formatter';
import { I18NService, I18NServiceSymbol } from './I18NService';
import localeMap from './translationMap';
import Period from '../interfaces/Period';

@singleton(I18NServiceSymbol)
class I18NServiceImpl implements I18NService {
	constructor(@inject(LocaleServiceSymbol) private readonly localeService: LocaleService) {
	}

	private static fillParameters(text: string, parameters?: unknown[]): string {
		if (!parameters || parameters.length === 0) {
			return text;
		}

		let formattedText = text;
		for (let idx = 0; idx < parameters.length; idx += 1) {
			const param = I18NServiceImpl.mapParameter(parameters[idx]);
			formattedText = formattedText.replace(`{${idx}}`, param);
		}
		return formattedText;
	}

	private static mapParameter(parameter: unknown): string {
		switch (typeof parameter) { // TODO: check if every case makes sense?!
		case 'string':
			return parameter;
		case 'boolean':
		case 'number':
		case 'bigint':
		case 'symbol':
			return parameter.toString();
		case 'function':
			return this.mapParameter(parameter());
		case 'object':
			if (parameter === null) {
				return '';
			}
			if (parameter instanceof DateTime) {
				return Formatter.formatDateTime(parameter);
			}
			if (parameter instanceof Duration) {
				return Formatter.formatDuration(parameter);
			}
			if ('text' in parameter) {
				return I18NServiceImpl.mapParameter((parameter as any).text);
			}
			return JSON.stringify(parameter);
		case 'undefined':
		default:
			return '';
		}
	}

	translate(key: string, ...parameters: unknown[]): string {
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
}
