import { DateTime, Duration } from 'luxon';
import { I18NService, I18NServiceSymbol } from '../i18n';
import Period from '../interfaces/Period';
import { IOCManager } from '../ioc/IOCManager';
import Lazy from '../storage/utils/Lazy';

const i18nServiceLazy = new Lazy( //
	() => IOCManager.INSTANCE.get<I18NService>(I18NServiceSymbol), //
);

export default class PeriodImpl implements Period {
	constructor(
		public readonly start: DateTime,
		public readonly end: DateTime,
	) {
	}

	private _duration?: Duration;

	get duration(): Duration {
		if (!this._duration) {
			this._duration = this.end.diff(this.start);
		}
		return this._duration;
	}

	private _text?: string;

	get text(): string {
		if (!this._text) {
			this._text = i18nServiceLazy.get()
				.translate(
					'global.duration',
					this.start,
					this.end.minus({ days: 1 }),
				);
		}
		return this._text;
	}
}
