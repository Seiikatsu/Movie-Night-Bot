import { DateTime, Duration } from 'luxon';
import ValidationException from '../exception/ValidationException';
import MovieNightService, { MovieNightServiceSymbol } from '../interfaces/MovieNightService';
import { requestScoped } from '../ioc';
import LuxonParser from '../utils/LuxonParser';

@requestScoped(MovieNightServiceSymbol)
class MovieNightServiceImpl implements MovieNightService {
	private static parseDate(dateString: string): DateTime | undefined {
		try {
			return LuxonParser.parseDateTime(dateString);
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}

	private static parseDuration(durationString: string): Duration | undefined {
		try {
			return LuxonParser.parseDuration(durationString);
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}

	async createMovieNight( //
		date: string, //
		suggestDuration: string, //
		voteDuration: string, //
		maxSuggestions: number | null, //
	): Promise<void> { //
		const parsedDate = MovieNightServiceImpl.parseDate(date);
		if (parsedDate === undefined) {
			throw new ValidationException('validation.global.invalid_format', LuxonParser.getDurationFormat());
		}

		const parsedSuggestDuration = MovieNightServiceImpl.parseDuration(suggestDuration);
		if (parsedSuggestDuration === undefined) {
			throw new ValidationException('validation.global.invalid_format', LuxonParser.getDurationFormat());
		}

		const parsedVoteDuration = MovieNightServiceImpl.parseDuration(voteDuration);
		if (parsedVoteDuration === undefined) {
			throw new ValidationException('validation.global.invalid_format', LuxonParser.getDurationFormat());
		}

		const minDate = DateTime.now().plus(parsedSuggestDuration).plus(parsedVoteDuration);

		if (parsedDate.diff(minDate).toMillis() < 0) {
			throw new Error('command.create_movie_night.validation.invalid_duration');
		}

		console.log(parsedDate.toISODate(), parsedSuggestDuration.toISO(), parsedVoteDuration.toISO());
	}
}
