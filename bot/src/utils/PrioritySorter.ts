import Prioritizable from '../interfaces/Prioritizable';

/**
 * Sort prioritizables (ascending).
 * @param a a
 * @param b b
 */
export default function sort(a: Prioritizable, b: Prioritizable) {
	return a.priority - b.priority;
}
