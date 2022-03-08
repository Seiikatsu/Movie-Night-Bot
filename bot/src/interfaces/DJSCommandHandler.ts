import { Interaction } from 'discord.js';

export default interface DJSCommandHandler {

	/**
	 * Handle the command, if executed by user.
	 */
	handle(interaction: Interaction): Promise<void>;
}

export const DJSCommandHandlerSymbol = Symbol.for('DJSCommandHandler');
