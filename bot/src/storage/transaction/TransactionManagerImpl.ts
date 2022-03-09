import { EntityManager } from 'typeorm';
import { requestScoped } from '../../ioc';
import getConnection from '../utils/getConnection';
import { TransactionManager, TransactionManagerSymbol } from './TransactionManager';

@requestScoped(TransactionManagerSymbol)
class TransactionManagerImpl implements TransactionManager {
	async initialize() {
		const connection = await getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.startTransaction();
		return queryRunner.manager;
	}

	async finalize(em: EntityManager) {
		const { queryRunner } = em;
		if (!queryRunner) {
			return;
		}
		await queryRunner.commitTransaction();
		await queryRunner.release();
	}

	async rollback(em: EntityManager) {
		if (!em) {
			return;
		}
		const { queryRunner } = em;
		if (!queryRunner) {
			return;
		}
		await queryRunner.rollbackTransaction();
		await queryRunner.release();
	}
}
