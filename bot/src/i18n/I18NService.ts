export interface I18NService {

	/**
	 * Translate the given {@code key} to a text with user locale.
	 * @param key the key
	 * @param parameters list of optional parameters
	 */
	translate(key: string, ...parameters: unknown[]): string;
}

export const I18NServiceSymbol = Symbol.for('I18NService');
