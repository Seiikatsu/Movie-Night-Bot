export default interface MovieNightService {
	createMovieNight( //
		date: string, //
		suggestDuration: string, //
		voteDuration: string, //
		maxSuggestions: number | null //
	): Promise<void>;
}

export const MovieNightServiceSymbol = Symbol.for('MovieNightService');
