import { Client, Interaction } from 'discord.js';
import DJSCommandHandler, { DJSCommandHandlerSymbol } from '../interfaces/DJSCommandHandler';
import StartupAction, { StartupActionSymbol } from '../interfaces/StartupAction';
import { singleton } from '../ioc';
import { IOCManager } from '../ioc/IOCManager';
import withPerformance from '../utils/withPerformance';

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
		const requestContainer = IOCManager.INSTANCE.createContainer();
		console.log(requestContainer.getAll(DJSCommandHandlerSymbol));
		if (requestContainer.isBoundNamed(DJSCommandHandlerSymbol, commandName)) {
			const commandHandler = requestContainer.getNamed<DJSCommandHandler>( //
				DJSCommandHandlerSymbol, //
				commandName, //
			);
			try {
				await withPerformance('command handle', commandHandler.handle(interaction));
				if (!interaction.replied) {
					await interaction.reply('ye mo ist gay');
				}
			} catch (e) {
				console.error('Error while handling command: ', e);
				await interaction.reply('Internal error');
			}
		} else {
			console.error(`Command '${commandName}' is not handled.`);
			await interaction.reply(`Command '${commandName}' not found.`);
		}
	};

	async onStartup(): Promise<void> {
		this.client.on('ready', () => {
			console.log(`Logged in as ${this.client.user?.tag}!`);
		});
		this.client.on('interactionCreate', DJSClient.onInteractionCreate);
		await withPerformance('login', this.client.login(process.env.DISCORD_TOKEN));
	}
}
