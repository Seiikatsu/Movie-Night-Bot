import crypto from 'crypto';
import { inject } from 'inversify';
import CommandService, { CommandServiceSymbol } from '../interfaces/CommandService';
import DJSCommand from '../interfaces/DJSCommand';
import { requestScoped } from '../ioc';
import CommandRepository from '../storage/repository/CommandRepository';

@requestScoped(CommandServiceSymbol)
class CommandServiceImpl implements CommandService {
	constructor( //
		@inject(CommandRepository) private readonly commandRepository: CommandRepository, //
	) { //
	}

	async getCommandHash(commandId: string): Promise<string | undefined> {
		const { commandRepository } = this;
		const commandStorage = await commandRepository.findByCommandId(commandId);
		return commandStorage?.commandHash;
	}

	async buildCommandHash(command: DJSCommand): Promise<string> {
		const commandDefinition = command.getCommandDefinition();

		const hashObject = crypto.createHash('sha1');
		hashObject.update(JSON.stringify(commandDefinition));

		return hashObject.digest('hex');
	}

	async createCommandHash(commandId: string, command: DJSCommand): Promise<void> {
		const { commandRepository } = this;
		const commandHash = await this.buildCommandHash(command);
		await commandRepository.create({
			commandId,
			commandHash,
		});
	}

	async updateCommandHash(commandId:string, command:DJSCommand): Promise<void> {
		const { commandRepository } = this;
		const commandStorage = await commandRepository.findByCommandId(commandId);
		if (!commandStorage) {
			console.warn(`Command with id ${commandId} does not exists.`);
			return;
		}

		commandStorage.commandHash = await this.buildCommandHash(command);
		await commandRepository.update(commandStorage);
	}
}
