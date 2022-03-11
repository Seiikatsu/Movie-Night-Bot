import { Column, Entity } from 'typeorm';
import AbstractStorageEntity from './AbstractStorageEntity';

@Entity('command')
export default class CommandStorage extends AbstractStorageEntity {
	@Column({ name: 'command_id' })
		commandId!: string;

	@Column({ name: 'command_hash' })
		commandHash!: string;
}
