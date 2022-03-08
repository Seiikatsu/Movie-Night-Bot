import StringUtils from './StringUtils';

/**
 * Get environment variable {@code key} as string.
 * @param key the key
 * @param required optional flag if the environment variable is required
 * @returns environment variable or undefined
 */
function getAsString(key: string, required: true): string;
function getAsString(key: string, required?: false): string | undefined;
function getAsString(key: string, required = false) {
	const envVariable = process.env[key];
	if (required) {
		if (StringUtils.isBlank(envVariable)) {
			throw new Error(`Environment variable not set: ${key}`);
		}
		return envVariable as string;
	}
	return envVariable;
}

export default {
	getAsString,
};
