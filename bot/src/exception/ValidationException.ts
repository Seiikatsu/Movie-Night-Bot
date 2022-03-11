import { I18NService, I18NServiceSymbol } from '../i18n';
import { IOCManager } from '../ioc/IOCManager';
import Lazy from '../storage/utils/Lazy';
import ExtendableError from './ExtendableError';

const lazyLocaleService = new Lazy(() => IOCManager.INSTANCE.get<I18NService>(I18NServiceSymbol));

export default class ValidationException extends ExtendableError {
	private readonly parameters?: unknown[];

	constructor(message: string, ...parameters: unknown[]) {
		super(message);
		this.parameters = parameters;
	}

	getText(): string {
		return lazyLocaleService.get().translate(this.message, this.parameters);
	}
}
