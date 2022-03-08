import { CommandInteraction } from 'discord.js';
import { DateTime, Duration } from 'luxon';
import DJSCommandHandler, { DJSCommandHandlerSymbol } from '../../interfaces/DJSCommandHandler';
import { named, requestScoped } from '../../ioc';
import LuxonParser from '../../utils/LuxonParser';
import CreateMovieNightCommand from '../commands/CreateMovieNight';

@named(CreateMovieNightCommand.COMMAND_ID)
@requestScoped(DJSCommandHandlerSymbol)
class CreateMovieNightCommandHandler implements DJSCommandHandler {
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

	async handle(interaction: CommandInteraction): Promise<void> {
		const date = interaction.options.getString(CreateMovieNightCommand.DATE_OPTION, true);
		const parsedDate = CreateMovieNightCommandHandler.parseDate(date);
		if (parsedDate === undefined) {
			return interaction.reply(`Invalid date format, use: ${LuxonParser.getDateTimeFormat()}`);
		}

		const suggestDuration = interaction.options.getString( //
			CreateMovieNightCommand.SUGGEST_DURATION, //
			true, //
		);
		const parsedSuggestDuration = CreateMovieNightCommandHandler.parseDuration(suggestDuration);
		if (parsedSuggestDuration === undefined) {
			return interaction.reply(`Invalid duration format, use: ${LuxonParser.getDurationFormat()}`);
		}

		const voteDuration = interaction.options.getString(CreateMovieNightCommand.VOTE_DURATION, true);
		const parsedVoteDuration = CreateMovieNightCommandHandler.parseDuration(voteDuration);
		if (parsedVoteDuration === undefined) {
			return interaction.reply(`Invalid duration format, use: ${LuxonParser.getDurationFormat()}`);
		}
		const maxSuggest = interaction.options.getNumber(CreateMovieNightCommand.MAX_SUGGEST_OPTIONS);

		return Promise.resolve(undefined);
	}
}
