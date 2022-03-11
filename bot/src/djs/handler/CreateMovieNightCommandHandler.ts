import { CommandInteraction } from 'discord.js';
import { inject } from 'inversify';
import ValidationException from '../../exception/ValidationException';
import DJSCommandHandler, { DJSCommandHandlerSymbol } from '../../interfaces/DJSCommandHandler';
import MovieNightService, { MovieNightServiceSymbol } from '../../interfaces/MovieNightService';
import { named, requestScoped } from '../../ioc';
import CreateMovieNightCommand from '../commands/CreateMovieNight';

@requestScoped(DJSCommandHandlerSymbol)
@named(CreateMovieNightCommand.COMMAND_ID)
class CreateMovieNightCommandHandler implements DJSCommandHandler {
	constructor(
		@inject(MovieNightServiceSymbol) private readonly movieNightService: MovieNightService,
	) {

	}

	async handle(interaction: CommandInteraction): Promise<void> {
		const { movieNightService } = this;
		try {
			await movieNightService.createMovieNight(
				interaction.options.getString(CreateMovieNightCommand.DATE_OPTION, true), //
				interaction.options.getString( //
					CreateMovieNightCommand.SUGGEST_DURATION, //
					true, //
				), //
				interaction.options.getString(CreateMovieNightCommand.VOTE_DURATION, true), //
				interaction.options.getNumber(CreateMovieNightCommand.MAX_SUGGEST_OPTIONS), //
			);
		} catch (e) {
			if (e instanceof ValidationException) {
				await interaction.reply(e.getText());
			}
			throw e;
		}
	}
}
