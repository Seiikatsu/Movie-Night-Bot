import { Clazz } from '../../@types/Clazz';

const namedMap = new WeakMap<Clazz, string>();

export function named(name: string) {
	return function _named<T extends Clazz>(constructor: T) {
		namedMap.set(constructor, name);
		return constructor;
	};
}

export function getNamed(clz: Clazz) {
	return namedMap.get(clz);
}
