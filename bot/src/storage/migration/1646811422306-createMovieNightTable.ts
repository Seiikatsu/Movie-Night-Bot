import {
	MigrationInterface, QueryRunner, Table, TableColumn,
} from 'typeorm';
import ColumnUtils from '../utils/ColumnUtils';

const TABLE = new Table({
	name: 'movie_night',
});

TABLE.addColumn(ColumnUtils.createPrimaryKeyColumn());

TABLE.addColumn(new TableColumn({
	name: 'suggest_until',
	type: 'bigint',
	isNullable: false,
	comment: 'UNIX timestamp until suggestions are allowed.',
}));

TABLE.addColumn(new TableColumn({
	name: 'vote_until',
	type: 'bigint',
	isNullable: false,
	comment: 'UNIX timestamp until votes are allowed.',
}));

export const MAX_SUGGESTIONS_COLUMN = new TableColumn({
	name: 'max_suggestions',
	type: 'int',
	comment: 'How many suggestions are allowed.',
});
TABLE.addColumn(MAX_SUGGESTIONS_COLUMN);

TABLE.addColumn(ColumnUtils.createCreatedAtColumn());
TABLE.addColumn(ColumnUtils.createUpdatedAtColumn());

export default class createMovieNightTable1646811422306 implements MigrationInterface {
	public up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(TABLE);
	}

	public down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.dropTable(TABLE);
	}
}
