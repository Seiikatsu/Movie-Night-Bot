import { SlashCommandBuilder } from '@discordjs/builders';
import DJSCommand, { DJSCommandSymbol } from '../../interfaces/DJSCommand';
import { singleton } from '../../ioc';

/**
 * Implements command definition to suggest a movie.
 */
@singleton(DJSCommandSymbol)
export default class SuggestMovieCommand implements DJSCommand {
	public static readonly COMMAND_ID = 'suggestmovie';

	private command: unknown;

	getCommandDefinition(): unknown {
		if (!this.command) {
			this.command = new SlashCommandBuilder() //
				.setName(SuggestMovieCommand.COMMAND_ID) //
				.setDescription('Suggest a movie for the next movie night.') //
				.addStringOption( //
					(option) => option.setName('movie') //
						.setDescription('IMDB Link to the movie')
						.setRequired(true), //
				)
				.toJSON();
		}
		return this.command;
	}
}
