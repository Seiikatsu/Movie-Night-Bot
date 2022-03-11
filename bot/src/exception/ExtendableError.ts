/**
 * Base error class, corrects name and stack.
 */
export default class ExtendableError extends Error {
	constructor(message: string) {
		super(message);
		// ensure that the name of the error is set to the actual class name
		// the name will be printed to the stacktrace
		this.name = this.constructor.name;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = new Error(message).stack;
		}
	}
}
