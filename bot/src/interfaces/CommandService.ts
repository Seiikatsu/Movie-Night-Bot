import DJSCommand from './DJSCommand';

export default interface CommandService {

	getCommandHash(commandId: string): Promise<string | undefined>;

	buildCommandHash(command: DJSCommand): Promise<string>;

	createCommandHash(commandId: string, command: DJSCommand): Promise<string>;
}

export const CommandServiceSymbol = Symbol.for('CommandService');
