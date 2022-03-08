import { SlashCommandBuilder } from '@discordjs/builders';
import { inject } from 'inversify';
import { I18NService, I18NServiceSymbol } from '../../i18n';
import DJSCommand, { DJSCommandSymbol } from '../../interfaces/DJSCommand';
import { singleton } from '../../ioc';
import LuxonParser from '../../utils/LuxonParser';

@singleton(DJSCommandSymbol)
export default class CreateMovieNightCommand implements DJSCommand {
	public static readonly COMMAND_ID = 'createmovienight';

	public static readonly DATE_OPTION = 'date';

	public static readonly SUGGEST_DURATION = 'suggestduration';

	public static readonly VOTE_DURATION = 'voteduration';

	public static readonly MAX_SUGGEST_OPTIONS = 'maxsuggestions';

	private command?: unknown;

	constructor(@inject(I18NServiceSymbol) private readonly localeService: I18NService) {
	}

	getCommandDefinition(): unknown {
		if (!this.command) {
			this.command = new SlashCommandBuilder() //
				.setName(CreateMovieNightCommand.COMMAND_ID) //
				.setDescription(this.localeService.translate('command.create_movie_night.description')) //
				.addStringOption( //
					(option) => option.setName(CreateMovieNightCommand.DATE_OPTION) //
						.setDescription(this.localeService.translate('command.create_movie_night.options.date.description', LuxonParser.getDateTimeFormat())) //
						.setRequired(true), //
				) //
				.addStringOption( //
					(option) => option.setName(CreateMovieNightCommand.SUGGEST_DURATION) //
						.setDescription(this.localeService.translate('command.create_movie_night.options.suggest_duration.description', LuxonParser.getDurationFormat())) //
						.setRequired(true), //
				) //
				.addStringOption( //
					(option) => option.setName(CreateMovieNightCommand.VOTE_DURATION) //
						.setDescription(this.localeService.translate('command.create_movie_night.options.vote_duration.description', LuxonParser.getDurationFormat())) //
						.setRequired(true), //
				) //
				.addNumberOption( //
					(option) => option.setName(CreateMovieNightCommand.MAX_SUGGEST_OPTIONS) //
						.setDescription(this.localeService.translate('command.create_movie_night.options.max_suggest.description')), //
				) //
				.toJSON();
		}
		return this.command;
	}
}
