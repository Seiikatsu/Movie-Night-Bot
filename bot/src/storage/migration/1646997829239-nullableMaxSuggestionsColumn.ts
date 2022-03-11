import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { MAX_SUGGESTIONS_COLUMN } from './1646811422306-createMovieNightTable';

const UPDATED_MAX_SUGGESTIONS_COLUMN = new TableColumn({
	...MAX_SUGGESTIONS_COLUMN,
	isNullable: true,
});

export default class nullableMaxSuggestionsColumn1646997829239 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.changeColumn(
			'movie_night',
			MAX_SUGGESTIONS_COLUMN,
			UPDATED_MAX_SUGGESTIONS_COLUMN,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.changeColumn(
			'movie_night',
			UPDATED_MAX_SUGGESTIONS_COLUMN,
			MAX_SUGGESTIONS_COLUMN,
		);
	}
}
