import { decorate, injectable } from 'inversify';
import { Clazz } from '../../@types/Clazz';
import { ServiceIdentifier } from './types';

const singletons = new Map<ServiceIdentifier<unknown>, Clazz[]>();

/**
 * Class decorator to mark a service as singleton.
 *
 * @param identifier optional identifier of the class
 */
export function singleton(identifier?: ServiceIdentifier<unknown>) {
	return function _singleton<T extends Clazz>(constructor: T) {
		decorate(injectable(), constructor);
		const key = identifier || constructor;
		let clazzes = singletons.get(key);
		if (!Array.isArray(clazzes)) {
			clazzes = [];
			singletons.set(key, clazzes);
		}
		clazzes.push(constructor);
		return constructor;
	};
}

export function getSingletons() {
	return singletons;
}
