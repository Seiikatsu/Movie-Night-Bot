import { Interaction } from 'discord.js';
import DJSCommandHandler, { DJSCommandHandlerSymbol } from '../../interfaces/DJSCommandHandler';
import { named, requestScoped } from '../../ioc';
import SuggestMovieCommand from '../commands/SuggestMovie';

@named(SuggestMovieCommand.COMMAND_ID)
@requestScoped(DJSCommandHandlerSymbol)
class SuggestMovieCommandHandler implements DJSCommandHandler {
	async handle(interaction: Interaction): Promise<void> {
		return Promise.resolve(undefined);
	}
}
