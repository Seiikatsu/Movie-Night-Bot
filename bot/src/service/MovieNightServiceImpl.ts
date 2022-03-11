import { inject } from 'inversify';
import { DateTime, Duration } from 'luxon';
import MovieNightEntity from '../entity/MovieNightEntity';
import PeriodImpl from '../entity/PeriodImpl';
import ValidationException from '../exception/ValidationException';
import MovieNightService, { MovieNightServiceSymbol } from '../interfaces/MovieNightService';
import Period from '../interfaces/Period';
import { requestScoped } from '../ioc';
import MovieNightRepository from '../storage/repository/MovieNightRepository';
import LuxonParser from '../utils/LuxonParser';

@requestScoped(MovieNightServiceSymbol)
class MovieNightServiceImpl implements MovieNightService {
	constructor( //
		@inject(MovieNightRepository) private readonly movieNightRepository: MovieNightRepository, //
	) { //
	}

	private static parseDate(dateString: string): DateTime {
		try {
			return LuxonParser.parseDateTime(dateString);
		} catch (e) {
			throw new ValidationException('validation.global.invalid_format', LuxonParser.getDateTimeFormat());
		}
	}

	private static parseDuration(durationString: string): Duration {
		try {
			return LuxonParser.parseDuration(durationString);
		} catch (e) {
			throw new ValidationException('validation.global.invalid_format', LuxonParser.getDurationFormat());
		}
	}

	async createMovieNight( //
		date: string, //
		suggestDuration: string, //
		voteDuration: string, //
		maxSuggestions: number | null, //
	): Promise<MovieNightEntity> { //
		const { movieNightRepository } = this;
		const parsedDate = MovieNightServiceImpl.parseDate(date);

		if (parsedDate.diff(DateTime.now()).toMillis() < 0) {
			throw new ValidationException('command.create_movie_night.validation.in_past');
		}

		const parsedSuggestDuration = MovieNightServiceImpl.parseDuration(suggestDuration);
		const parsedVoteDuration = MovieNightServiceImpl.parseDuration(voteDuration);

		const minDate = DateTime.now()
			.plus(parsedSuggestDuration)
			.plus(parsedVoteDuration);

		if (parsedDate.diff(minDate).toMillis() < 0) {
			throw new ValidationException('command.create_movie_night.validation.invalid_duration');
		}

		const storage = await movieNightRepository.create({
			date: parsedDate,
			suggestUntil: parsedSuggestDuration,
			voteUntil: parsedVoteDuration,
			maxSuggestions,
		});

		return new MovieNightEntity(
			storage.id,
			storage.date,
			storage.suggestUntil,
			storage.voteUntil,
		);
	}

	getSuggestPeriod(entity: MovieNightEntity): Period {
		const { date, voteDuration, suggestDuration } = entity;
		const endDate = date.minus(voteDuration);
		const startDate = endDate.minus(suggestDuration);
		return new PeriodImpl(startDate, endDate.plus({
			days: 1,
		}));
	}

	getVotePeriod(entity: MovieNightEntity): Period {
		const { date, voteDuration } = entity;
		const startDate = date.minus(voteDuration);
		return new PeriodImpl(startDate, date.plus({
			days: 1,
		}));
	}
}
