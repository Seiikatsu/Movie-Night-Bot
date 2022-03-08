/**
 * Await the given {@code cb} and messure time.
 * @param name name for logging.
 * @param cb callback to execute
 * @returns {@code cb} result
 */
export default async function withPerformance<T>(name: string, cb: Promise<T>) {
	const start = performance.now();
	const result = await cb;
	console.log(`${name} took ${(performance.now() - start).toFixed(0)}ms`);
	return result;
}
