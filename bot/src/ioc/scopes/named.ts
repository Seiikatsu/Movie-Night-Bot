import { Clazz } from '../../@types/Clazz';

const namedMap = new WeakMap<Clazz<unknown>, string>();

export function named(name: string) {
	return function _named<T extends Clazz<unknown>>(constructor: T) {
		namedMap.set(constructor, name);
		return constructor;
	};
}

export function getNamed(clz: Clazz<unknown>) {
	return namedMap.get(clz);
}
