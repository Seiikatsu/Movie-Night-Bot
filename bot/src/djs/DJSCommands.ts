import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { multiInject } from 'inversify';
import DJSCommand, { DJSCommandSymbol } from '../interfaces/DJSCommand';
import StartupAction, { StartupActionSymbol } from '../interfaces/StartupAction';
import { singleton } from '../ioc';
import EnvironmentUtils from '../utils/EnvironmentUtils';
import withPerformance from '../utils/withPerformance';

@singleton(StartupActionSymbol)
export default class DJSCommands implements StartupAction {
	readonly priority: number = 5;

	private readonly rest: REST;

	constructor( //
		@multiInject(DJSCommandSymbol) private readonly commands: DJSCommand[], //
	) {
		this.rest = new REST({ version: '10' }) //
			.setToken(EnvironmentUtils.getAsString('DISCORD_TOKEN', true));
	}

	async onStartup(): Promise<void> {
		try {
			const guildId = await this.getGuildId();
			await this.deleteAllCommands(guildId);
			await this.createCommands(guildId);
		} catch (error) {
			console.error(error);
		}
	}

	private async getGuildId() {
		const response = await this.rest.get(Routes.userGuilds());
		if (Array.isArray(response)) {
			const find = response.find((guild) => 'id' in guild);
			if ('id' in find) {
				return find.id;
			}
		}
		const { id } = (response as any)[0];
		return id;
	}

	private async deleteAllCommands(guildId: string) {
		const cb = async () => {
			const commands = await this.rest.get(Routes.applicationGuildCommands('947455963735138335', guildId));
			if (Array.isArray(commands)) {
				const promises = commands.map((command) => {
					if ('id' in command) {
						return this.rest.delete(Routes.applicationGuildCommand('947455963735138335', guildId, command.id));
					}
					return Promise.resolve();
				});
				await Promise.all(promises);
			}
		};
		await withPerformance('deleteAllCommands', cb());
	}

	private async createCommands(guildId: string) {
		await withPerformance('createCommands', Promise.all(
			this.commands.map((command) => this.rest.post(Routes.applicationGuildCommands('947455963735138335', guildId), {
				body: command.getCommandDefinition(),
			})),
		));
	}
}
