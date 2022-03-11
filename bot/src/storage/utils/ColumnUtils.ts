import { TableColumn } from 'typeorm';

function createPrimaryKeyColumn() {
	return new TableColumn({
		name: 'id',
		type: 'integer',
		isNullable: false,
		isGenerated: true,
		generationStrategy: 'increment',
		isPrimary: true,
		isUnique: true,
	});
}

function createCreatedAtColumn() {
	return new TableColumn({
		name: 'created_at',
		type: 'timestamp',
		default: 'now()',
	});
}

function createUpdatedAtColumn() {
	return new TableColumn({
		name: 'updated_at',
		type: 'timestamp',
		default: 'now()',
	});
}

export default {
	createPrimaryKeyColumn,
	createCreatedAtColumn,
	createUpdatedAtColumn,
};
