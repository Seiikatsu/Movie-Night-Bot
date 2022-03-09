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

enum Environment {
	TEST = 'test',
	DEVELOPMENT = 'development',
	STAGING = 'staging',
	PRODUCTION = 'production',
}

let env: Environment | undefined;

function getEnvironment(): Environment {
	if (!env) {
		const e = process.env.NODE_ENV;
		switch (e?.toLowerCase()) {
		case 'test':
			env = Environment.TEST;
			break;
		case 'staging':
			env = Environment.STAGING;
			break;
		case 'production':
			env = Environment.PRODUCTION;
			break;
		default:
			env = Environment.DEVELOPMENT;
			break;
		}
	}
	return env;
}

export default {
	getAsString,
	getEnvironment,
	isTest: () => getEnvironment() === Environment.TEST,
	isDevelopment: () => getEnvironment() === Environment.DEVELOPMENT,
	isStaging: () => getEnvironment() === Environment.STAGING,
	isProduction: () => getEnvironment() === Environment.PRODUCTION,
};
