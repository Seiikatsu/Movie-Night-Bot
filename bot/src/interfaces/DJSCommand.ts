export default interface DJSCommand {
	/**
	 * Get command definition.
	 *
	 * @returns command definition
	 */
	getCommandDefinition(): unknown;
}

export const DJSCommandSymbol = Symbol.for('DJSCommand');
