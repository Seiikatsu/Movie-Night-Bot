export default class Lazy<T> {
	private impl?: T;

	constructor(private readonly supplierFunction: () => T) {
	}

	get(): T {
		if (!this.impl) {
			this.impl = this.supplierFunction();
		}
		return this.impl;
	}
}
