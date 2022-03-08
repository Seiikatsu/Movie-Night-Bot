/* eslint-disable no-param-reassign,no-return-assign,@typescript-eslint/ban-ts-comment */
import { Locale } from 'discord-api-types/v10';
import {
	DateTime, Duration, DurationLikeObject, Settings,
} from 'luxon';
import { PartialRecord } from '../@types/PartialRecord';
import { IOCManager } from '../ioc/IOCManager';
import { LocaleService, LocaleServiceSymbol } from '../locale';

Settings.throwOnInvalid = true;

// https://moment.github.io/luxon/#/parsing?id=table-of-tokens
const DATE_TIME_FORMAT_MAP: PartialRecord<Locale, string> = {
	[Locale.EnglishUS]: 'MM-dd-yyyy hh:mm',
	[Locale.German]: 'dd.MM.yyyy HH:mm',
};

let locale: Locale;

function getLocale(): Locale {
	if (!locale) {
		locale = IOCManager.INSTANCE.get<LocaleService>(LocaleServiceSymbol)
			.getLocale();
	}
	if (!locale) {
		throw new Error('Could not determine locale!');
	}
	return locale;
}

let dateTimeFormat: string | undefined;

function getDateTimeFormat(): string {
	if (!dateTimeFormat) {
		locale = getLocale();
		dateTimeFormat = DATE_TIME_FORMAT_MAP[locale];
	}
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return dateTimeFormat ?? DATE_TIME_FORMAT_MAP[Locale.EnglishUS]!;
}

function parseDateTime(unparsed: string): DateTime {
	return DateTime.fromFormat(unparsed.trim(), getDateTimeFormat(), {
		locale,
	});
}

type MapperFunction = (config: DurationLikeObject, value: number) => void;
const DURATION_MAPPERS: PartialRecord<string, MapperFunction> = {
	m: (c, v) => c.months = v,
	w: (c,v) => c.weeks = v,
	d: (c, v) => c.days = v,
	h: (c, v) => c.hours = v,
};

function getDurationFormat() {
	return '1m 1w 1d 1h';
}

function parseDuration(unparsed: string): Duration {
	const durationConfig: DurationLikeObject = {};
	const parts = unparsed.split(' ');
	parts.map((part) => {
		const number = part.substring(0, part.length - 1);
		const unit = part.charAt(part.length - 1)
			.toLowerCase();
		try {
			const numberValue = Number.parseInt(number, 10);
			const durationMapperFunction = DURATION_MAPPERS[unit];
			if (durationMapperFunction === undefined) {
				return undefined;
			}
			return [numberValue, durationMapperFunction];
		} catch (e) {
			return undefined;
		}
	})
		.filter((v) => v !== undefined)
		// @ts-ignore
		.forEach(([numberValue, mapperFunction]) => mapperFunction(durationConfig, numberValue));

	const duration = Duration.fromDurationLike(durationConfig);
	if (duration.toMillis() <= 1000) {
		throw new Error('Duration invalid, must be at least 1 second.');
	}
	return duration;
}

export default {
	getDateTimeFormat,
	parseDateTime,
	getDurationFormat,
	parseDuration,
};
