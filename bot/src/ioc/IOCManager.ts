import { Container, interfaces } from 'inversify';
import { EntityManagerSymbol, TransactionManager, TransactionManagerSymbol } from '../storage';
import { getServices, getSingletons } from './scopes';
import { getNamed } from './scopes/named';
import { ServiceIdentifier } from './scopes/types';

export type ContainerInterface = interfaces.Container;

/**
 * Implementation to manage ioc containers.
 */
export class IOCManager {
	private static instance: IOCManager;

	private readonly mainContainer = new Container({
		defaultScope: 'Singleton',
	});

	private readonly containers = new Map<number, ContainerInterface>();

	/**
	 * Get instanceof ioc manager.
	 */
	public static get INSTANCE() {
		if (IOCManager.instance === undefined) {
			const instance = new IOCManager();
			getSingletons()
				.forEach((value, key) => value
					.forEach((clz) => instance.mainContainer.bind(key)
						.to(clz)
						.inSingletonScope()));
			IOCManager.instance = instance;
		}
		return IOCManager.instance;
	}

	/**
	 * Get a service by its identifier.
	 *
	 * @param service the service
	 */
	public get<T>(service: ServiceIdentifier<T>): T {
		return this.mainContainer.get(service);
	}

	/**
	 * Get all services matching given identifier.
	 *
	 * @param service the service
	 */
	public getAll<T>(service: ServiceIdentifier<T>): T[] {
		return this.mainContainer.getAll(service);
	}

	/**
	 * Create a new ioc container and execute the {@code cb} within that container.
	 * New transaction will be created and bound to the container, everything will be destroyed
	 * after the callback was executed.
	 * @param cb the callback
	 */
	public async executeInRequestScope(cb: (container: ContainerInterface) => Promise<void>) {
		const requestContainer = this.createContainer();

		// create new transaction for scope
		const transactionManager = requestContainer.get<TransactionManager>(TransactionManagerSymbol);
		const entityManager = await transactionManager.initialize();
		requestContainer.bind(EntityManagerSymbol)
			.toConstantValue(entityManager);

		try {
			await cb(requestContainer);
			await transactionManager.finalize(entityManager);
		} catch (e) {
			await transactionManager.rollback(entityManager);
		} finally {
			this.destroyContainer(requestContainer.id);
		}
	}

	/**
	 * Create a new container on with request scope as default.
	 *
	 * @returns Tuple with the id of the container and the container itself.
	 */
	public createContainer(): ContainerInterface {
		const container = this.mainContainer.createChild({
			defaultScope: 'Request',
		});
		getServices() //
			.forEach((value, key) => value //
				.forEach((clz) => {
					const serviceDefinition = container.bind(key) //
						.to(clz) //
						.inRequestScope(); //

					const named = getNamed(clz);
					if (named) {
						serviceDefinition.whenTargetNamed(named);
					}
				}));
		this.containers.set(container.id, container);
		return container;
	}

	/**
	 * Get a container by its id.
	 *
	 * @param id - The container id.
	 *
	 * @returns The container.
	 *
	 * @throws Error if the container does not exist.
	 */
	public getContainer(id: number): ContainerInterface {
		const container = this.containers.get(id);
		if (!container) {
			throw new Error(`Container ${id} is not defined`);
		}
		return container;
	}

	/**
	 * Destroy the given container.
	 *
	 * @param id - The id of the container.
	 */
	public destroyContainer(id: number) {
		const container = this.containers.get(id);
		if (!container) {
			throw new Error(`Container ${id} is not defined`);
		}
		container.unbindAll();
		this.containers.delete(id);
	}
}
