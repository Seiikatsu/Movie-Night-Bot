/**
 * Checks if given {@code value} is blank (undefined, or empty).
 * @param value the value to check
 * @returns true if {@code value} is blank
 */
function isBlank(value?: string): boolean {
	return value === undefined || value.length === 0 || value.trim().length === 0;
}

export default {
	isBlank,
};
