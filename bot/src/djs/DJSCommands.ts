import { REST } from '@discordjs/rest';
import {
	APIApplicationCommand,
} from 'discord-api-types/payloads/v10/_interactions/applicationCommands';
import { RESTGetAPIApplicationCommandsResult } from 'discord-api-types/rest/v10/interactions';
import { Routes, Snowflake } from 'discord-api-types/v10';
import { inject, multiInject } from 'inversify';
import CommandService, { CommandServiceSymbol } from '../interfaces/CommandService';
import DJSCommand, { DJSCommandSymbol } from '../interfaces/DJSCommand';
import StartupAction, { StartupActionSymbol } from '../interfaces/StartupAction';
import { requestScoped } from '../ioc';
import EnvironmentUtils from '../utils/EnvironmentUtils';

@requestScoped(StartupActionSymbol)
export default class DJSCommands implements StartupAction {
	readonly priority: number = 0;

	private readonly rest: REST;

	constructor( //
		@multiInject(DJSCommandSymbol) private readonly commands: DJSCommand[], //
		@inject(CommandServiceSymbol) private readonly commandService: CommandService, //
	) {
		this.rest = new REST({ version: '10' }) //
			.setToken(EnvironmentUtils.getAsString('DISCORD_TOKEN', true));
	}

	async onStartup(): Promise<void> {
		try {
			await this.updateCommands();
		} catch (error) {
			console.error(error);
		}
	}

	private async updateCommands() {
		const {
			commands,
			commandService,
		} = this;
		const guildId = EnvironmentUtils.getAsString('GUILD_ID', true);
		const applicationId = EnvironmentUtils.getAsString('APPLICATION_ID', true);

		// map all existing commands for easier access
		const commandDefinitionMap = commands.reduce((a, v) => ({ //
			...a, //
			[v.getCommandDefinition().name]: v, //
		}), {}) as Record<string, DJSCommand>;

		const existingCommands = (await this.rest.get(Routes.applicationGuildCommands( //
			applicationId, //
			guildId, //
		)) as RESTGetAPIApplicationCommandsResult);

		const commandsToCreate = Object.keys(commandDefinitionMap);
		const promises: Promise<void>[] = existingCommands.map((existingCommand) => {
			const commandDefinition = commandDefinitionMap[existingCommand.name];

			// command does not exist anymore, delete it
			if (commandDefinition === undefined) {
				return this.deleteCommand(existingCommand, applicationId, guildId);
			}

			commandsToCreate.splice(commandsToCreate.indexOf(existingCommand.name), 1);
			return (async () => {
				const existingHash = await commandService.getCommandHash(existingCommand.id);
				const newHash = await commandService.buildCommandHash(commandDefinition);

				if (existingHash !== newHash) {
					return this.updateCommand(commandDefinition, existingCommand.id, applicationId, guildId);
				}
				return Promise.resolve();
			})();
		});

		if (commandsToCreate.length > 0) {
			promises.push(...commandsToCreate.map((c) => commandDefinitionMap[c]) //
				.filter((c) => c !== undefined) //
				.map((c) => this.createCommand(c, applicationId, guildId)));
		}

		await Promise.all(promises);
	}

	private createCommand = async ( //
		command: DJSCommand, //
		applicationId: Snowflake, //
		guildId: Snowflake, //
	): Promise<void> => { //
		const {
			rest,
			commandService,
		} = this;
		const commandDefinition = command.getCommandDefinition();
		const createdCommand = await rest.post(
			Routes.applicationGuildCommands(applicationId, guildId),
			{ //
				body: commandDefinition, //
			}, //
		);
		if (typeof createdCommand === 'object' && createdCommand !== null && 'id' in createdCommand) {
			await commandService.createCommandHash((createdCommand as APIApplicationCommand).id, command);
		}
	};

	private async updateCommand( //
		command: DJSCommand, //
		commandId: Snowflake,
		applicationId: Snowflake, //
		guildId: Snowflake, //
	): Promise<void> { //
		const { rest, commandService } = this;
		const commandDefinition = command.getCommandDefinition();
		console.log('update command', commandDefinition.name, commandDefinition);
		await rest.patch(Routes.applicationGuildCommand(applicationId, guildId, commandId), { //
			body: commandDefinition, //
		});
		await commandService.updateCommandHash(commandId, command);
	}

	private async deleteCommand( //
		command: APIApplicationCommand, //
		applicationId: Snowflake, //
		guildId: Snowflake, //
	): Promise<void> { //
		const { rest } = this;
		const { id: commandId } = command;
		console.log('delete command', command.name, command);
		await rest.delete(Routes.applicationGuildCommand(applicationId, guildId, commandId));
	}
}
