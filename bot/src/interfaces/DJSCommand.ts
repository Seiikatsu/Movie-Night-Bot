import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/rest/v10/interactions';

export default interface DJSCommand {
	/**
	 * Get command definition.
	 *
	 * @returns command definition
	 */
	getCommandDefinition(): RESTPostAPIApplicationCommandsJSONBody;
}

export const DJSCommandSymbol = Symbol.for('DJSCommand');
