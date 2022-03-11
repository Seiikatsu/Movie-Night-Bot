import { Clazz } from '../../@types/Clazz';
import { requestScoped } from '../../ioc';
import CommandStorage from '../entity/CommandStorage';
import AbstractRepository from './AbstractRepository';

@requestScoped()
export default class CommandRepository extends AbstractRepository<CommandStorage> {
	public async findByCommandId(commandId: string): Promise<CommandStorage | undefined> {
		return this.getOrmRepository()
			.findOne({
				where: {
					commandId,
				},
			});
	}

	protected getEntityType(): Clazz<CommandStorage> {
		return CommandStorage;
	}
}
