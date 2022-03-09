import { EntityManager } from 'typeorm';

export interface TransactionManager {
	initialize(): Promise<EntityManager>;
	finalize(em: EntityManager): Promise<void>;
	rollback(em: EntityManager): Promise<void>;
}

export const TransactionManagerSymbol = Symbol.for('TransactionManager');
