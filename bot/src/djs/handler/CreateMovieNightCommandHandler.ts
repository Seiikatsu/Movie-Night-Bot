import { CommandInteraction, MessageEmbed } from 'discord.js';
import { inject } from 'inversify';
import ValidationException from '../../exception/ValidationException';
import { I18NService, I18NServiceSymbol } from '../../i18n';
import DJSCommandHandler, { DJSCommandHandlerSymbol } from '../../interfaces/DJSCommandHandler';
import MovieNightService, { MovieNightServiceSymbol } from '../../interfaces/MovieNightService';
import { named, requestScoped } from '../../ioc';
import Formatter from '../../utils/Formatter';
import CreateMovieNightCommand from '../commands/CreateMovieNight';
import DJSColors from '../DJSColors';

@requestScoped(DJSCommandHandlerSymbol)
@named(CreateMovieNightCommand.COMMAND_ID)
class CreateMovieNightCommandHandler implements DJSCommandHandler {
	constructor(
		@inject(MovieNightServiceSymbol) private readonly movieNightService: MovieNightService,
		@inject(I18NServiceSymbol) private readonly i18nService: I18NService,
	) {

	}

	async handle(interaction: CommandInteraction): Promise<void> {
		const {
			movieNightService,
			i18nService,
		} = this;
		try {
			const entity = await movieNightService.createMovieNight(
				interaction.options.getString(CreateMovieNightCommand.DATE_OPTION, true), //
				interaction.options.getString( //
					CreateMovieNightCommand.SUGGEST_DURATION, //
					true, //
				), //
				interaction.options.getString(CreateMovieNightCommand.VOTE_DURATION, true), //
				interaction.options.getNumber(CreateMovieNightCommand.MAX_SUGGEST_OPTIONS), //
			);

			const suggestPeriod = movieNightService.getSuggestPeriod(entity);
			const votePeriod = movieNightService.getVotePeriod(entity);

			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(DJSColors.INFO)
						.setTitle(i18nService.translate('command.create_movie_night.response.title'))
						.addFields([
							{
								name: i18nService.translate('command.create_movie_night.response.fields.date'),
								value: Formatter.formatDateTime(entity.date),
							},
							{
								name: i18nService.translate('command.create_movie_night.response.fields.suggest_duration'),
								value: Formatter.formatDurationWithPeriod(entity.suggestDuration, suggestPeriod),
							},
							{
								name: i18nService.translate('command.create_movie_night.response.fields.vote_duration'),
								value: Formatter.formatDurationWithPeriod(entity.voteDuration, votePeriod),
							},
						])
						.setTimestamp(),
				],
			});
		} catch (e) {
			if (e instanceof ValidationException) {
				await interaction.reply({
					embeds: [
						new MessageEmbed() //
							.setColor(DJSColors.ERROR) //
							.setTitle(i18nService.translate('global.error')) //
							.setDescription(e.getText()), //
					],
					ephemeral: true,
				});
				return;
			}
			throw e;
		}
	}
}
