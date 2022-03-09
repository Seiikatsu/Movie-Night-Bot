import {
	CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

export default abstract class AbstractStorageEntity {
	@PrimaryGeneratedColumn('increment')
		id!: number;

	@CreateDateColumn({ name: 'created_at' })
		createdAt!: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt!: Date;
}
