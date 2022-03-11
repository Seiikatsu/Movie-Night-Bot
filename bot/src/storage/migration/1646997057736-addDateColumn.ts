import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const COLUMN = new TableColumn({
	name: 'date',
	type: 'bigint',
	isNullable: false,
	comment: 'UNIX timestamp for the date of the movie night',
});

export default class addDateColumn1646997057736 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.addColumn('movie_night', COLUMN);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.dropColumn('movie_night', COLUMN);
	}
}
