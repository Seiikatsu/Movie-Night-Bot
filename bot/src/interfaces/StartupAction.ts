import Prioritizable from './Prioritizable';
/**
 * Interface of a generic startup action. Will run
 */
export default interface StartupAction extends Prioritizable {
	onStartup(): void | Promise<void>;
}

export const StartupActionSymbol = Symbol.for('StartupAction');
