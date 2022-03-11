import MovieNightEntity from '../entity/MovieNightEntity';
import Period from './Period';

export default interface MovieNightService {
	createMovieNight( //
		date: string, //
		suggestDuration: string, //
		voteDuration: string, //
		maxSuggestions: number | null //
	): Promise<MovieNightEntity>;

	getSuggestPeriod(entity: MovieNightEntity): Period;

	getVotePeriod(entity: MovieNightEntity): Period;
}

export const MovieNightServiceSymbol = Symbol.for('MovieNightService');
