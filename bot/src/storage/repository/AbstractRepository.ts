import { inject, injectable } from 'inversify';
import { Clazz } from '../../@types/Clazz';
import AbstractStorageEntity from '../entity/AbstractStorageEntity';
import EntityManager, { EntityManagerSymbol } from '../EntityManager';

@injectable()
export default abstract class AbstractRepository<ENTITY extends AbstractStorageEntity> {
	@inject(EntityManagerSymbol)
	private em!: EntityManager;

	create(data: Omit<ENTITY, 'id' | 'createdAt' | 'updatedAt'>) {
		const entity = new (this.getEntityType())();
		// define the type of the key as it defaults to 'string'
		Object.entries(data)
			.forEach(([key, value]) => {
				if (Object.prototype.hasOwnProperty.call(data, key)) {
					// @ts-ignore
					entity[key] = value;
				}
			});
		return this.em.save(entity);
	}

	async findById(id: string): Promise<ENTITY> {
		const entity = await this.getOrmRepository()
			.findOne(id, {
				relations: this.getDefaultRelations(),
			});
		if (entity == null) {
			throw new Error(`Could not find entity with id=${id}`);
		}
		return entity;
	}

	findAll() {
		return this.getOrmRepository()
			.find({
				relations: this.getDefaultRelations(),
			});
	}

	update(entity: ENTITY) {
		if (!entity.id) {
			throw new Error('Could not find entity with id=null');
		}
		return this.em.save(entity);
	}

	remove(entity: ENTITY) {
		return this.getOrmRepository()
			.remove(entity);
	}

	count() {
		return this.getOrmRepository()
			.count();
	}

	protected abstract getEntityType(): Clazz<ENTITY>;

	protected getOrmRepository() {
		return this.em.getRepository<ENTITY>(this.getEntityType());
	}

	protected getDefaultRelations(): string[] {
		return [];
	}
}
