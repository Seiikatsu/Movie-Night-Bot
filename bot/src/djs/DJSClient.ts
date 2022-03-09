import { Client, Interaction } from 'discord.js';
import DJSCommandHandler, { DJSCommandHandlerSymbol } from '../interfaces/DJSCommandHandler';
import StartupAction, { StartupActionSymbol } from '../interfaces/StartupAction';
import { singleton } from '../ioc';
import { IOCManager } from '../ioc/IOCManager';
import EnvironmentUtils from '../utils/EnvironmentUtils';

@singleton(StartupActionSymbol)
export default class DJSClient implements StartupAction {
	readonly priority = 0;

	private readonly client: Client;

	constructor() {
		this.client = new Client({
			intents: [],
		});
	}

	private static onInteractionCreate = async (interaction: Interaction) => {
		if (!interaction.isCommand()) {
			return;
		}
		const { commandName } = interaction;
		await IOCManager.INSTANCE.executeInRequestScope(async (requestContainer) => {
			if (requestContainer.isBoundNamed(DJSCommandHandlerSymbol, commandName)) {
				try {
					const commandHandler = requestContainer.getNamed<DJSCommandHandler>( //
						DJSCommandHandlerSymbol, //
						commandName, //
					);

					await commandHandler.handle(interaction);
					if (!interaction.replied) {
						await interaction.reply('Command executed.');
					}
				} catch (e) {
					await interaction.reply('Internal error');
					throw e;
				}
			} else {
				console.error(`Command '${commandName}' is not handled.`);
				await interaction.reply(`Command '${commandName}' not found.`);
			}
		});
	};

	async onStartup(): Promise<void> {
		this.client.on('ready', () => {
			console.log(`Logged in as ${this.client.user?.tag}!`);
		});
		this.client.on('interactionCreate', DJSClient.onInteractionCreate);
		await this.client.login(EnvironmentUtils.getAsString('DISCORD_TOKEN', true));
	}
}
