import humanizeDuration from 'humanize-duration';
import { DateTime, Duration } from 'luxon';
import { I18NService, I18NServiceSymbol } from '../i18n';
import Period from '../interfaces/Period';
import { IOCManager } from '../ioc/IOCManager';
import { LocaleService, LocaleServiceSymbol } from '../locale';
import Lazy from '../storage/utils/Lazy';
import LuxonParser from './LuxonParser';

// locale ISO 639-1
const lazyShortLocale = new Lazy(() => {
	let locale: string = IOCManager.INSTANCE.get<LocaleService>(LocaleServiceSymbol).getLocale();
	if (locale.length > 2) {
		locale = locale.substring(0, 2);
	}
	return locale;
});

const i18NServiceLazy = new Lazy(() => IOCManager.INSTANCE.get<I18NService>(I18NServiceSymbol));

function formatDateTime(dateTime: DateTime) {
	return dateTime.toFormat(LuxonParser.getDateTimeFormat());
}

function formatDuration(duration: Duration) {
	return humanizeDuration(duration.toMillis(), {
		language: lazyShortLocale.get(),
	});
}

/**
 * Format the given {@code duration} and append {@code targetDate}.
 * e.g.: 1 day (xx.xx.xxxx)
 *
 * @param duration duration to format
 * @param targetDate target date
 */
function formatDurationWithDate(duration: Duration, targetDate: DateTime) {
	return i18NServiceLazy.get().translate( //
		'global.duration.with_date', //
		duration, //
		targetDate, //
	);
}

/**
 * Format the given {@code duration} and append {@code period}.
 * e.g.: 1 day (xx.xx.xxxx - xx.xx.xxxx)
 *
 * @param duration duration to format
 * @param period the period to append
 */
function formatDurationWithPeriod(duration: Duration, period: Period) {
	return i18NServiceLazy.get().translate( //
		'global.duration.with_period', //
		duration, //
		period, //
	);
}

export default {
	formatDuration,
	formatDateTime,
	formatDurationWithDate,
	formatDurationWithPeriod,
};
