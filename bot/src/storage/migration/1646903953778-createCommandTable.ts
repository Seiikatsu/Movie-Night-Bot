import {
	MigrationInterface, QueryRunner, Table, TableColumn,
} from 'typeorm';
import ColumnUtils from '../utils/ColumnUtils';

const TABLE = new Table({
	name: 'command',
});

TABLE.addColumn(ColumnUtils.createPrimaryKeyColumn());

TABLE.addColumn(new TableColumn({
	name: 'command_id',
	type: 'varchar',
	isNullable: false,
	isUnique: true,
	comment: 'Command id from discord api',
}));

TABLE.addColumn(new TableColumn({
	name: 'command_hash',
	type: 'varchar',
	isNullable: false,
	comment: 'unique hash for the command',
}));

TABLE.addColumn(ColumnUtils.createCreatedAtColumn());
TABLE.addColumn(ColumnUtils.createUpdatedAtColumn());

export default class createCommandTable1646903953778 implements MigrationInterface {
	public up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(TABLE);
	}

	public down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(TABLE);
	}
}
