import { decorate, injectable } from 'inversify';
import { Clazz } from '../../@types/Clazz';
import { ServiceIdentifier } from './types';

const services = new Map<ServiceIdentifier<unknown>, Clazz<unknown>[]>();

export function requestScoped(identifier?: ServiceIdentifier<unknown>) {
	return function _requestScoped<T extends Clazz<unknown>>(constructor: T) {
		decorate(injectable(), constructor);
		const key = identifier || constructor;
		let clazzes = services.get(key);
		if (!Array.isArray(clazzes)) {
			clazzes = [];
			services.set(key, clazzes);
		}
		clazzes.push(constructor);
		return constructor;
	};
}

export function getServices() {
	return services;
}
