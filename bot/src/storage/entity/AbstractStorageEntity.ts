import { DateTime } from 'luxon';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DateTimeTransformer from '../transformer/DateTimeTransformer';

export default abstract class AbstractStorageEntity {
	@PrimaryGeneratedColumn('increment')
		id!: number;

	@CreateDateColumn({
		name: 'created_at',
		type: 'bigint',
		transformer: DateTimeTransformer,
	})
		createdAt!: DateTime;

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'bigint',
		transformer: DateTimeTransformer,
	})
		updatedAt!: DateTime;
}
