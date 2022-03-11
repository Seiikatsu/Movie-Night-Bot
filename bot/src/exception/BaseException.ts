import ExtendableError from './ExtendableError';

// content that should not be visible on the stack trace
const forbiddenContent = ['(internal/modules/', 'run_main_module.js'];

/**
 * Filter the given {@code stack} and remove all lines that are not needed in the stack trace.
 * e.g.: internal nodejs lines
 *
 * @param stack - The stack to filter.
 *
 * @returns The filtered stack.
 */
const filterStack = (stack: string) => {
	let stackLines = stack.split('\n');
	stackLines = stackLines.filter( //
		(line) => !forbiddenContent.find((forbidden) => line.includes(forbidden)), //
	);
	return stackLines.join('\n');
};

/**
 * Base implementation of an error class that can be encapsulated.
 * Allows for stacktrace extension from inherited error.
 */
export default class BaseException extends ExtendableError {
	constructor(message: string, error?: Error) {
		super(message);
		// filter all 'node internal' lines out of the stack trace
		this.stack = this.stack ? filterStack(this.stack) : undefined;

		// is  this error just encapsulated?
		if (error) {
			// include the message of the encapsulated error
			if (error.message) {
				this.message += `: ${error.message}`;
			}

			// include the stack of the encapsulated error
			if (error.stack) {
				this.stack += `\ncaused by: ${error.stack}`;
			}
		}
	}
}
