import { TableColumn } from 'typeorm';

function createPrimaryKeyColumn() {
	return new TableColumn({
		name: 'id',
		type: 'integer',
		isPrimary: true,
		isGenerated: true,
	});
}

function createCreatedAtColumn() {
	return new TableColumn({
		name: 'createdAt',
		type: 'timestamp',
		default: 'now()',
	});
}

function createUpdatedAtColumn() {
	return new TableColumn({
		name: 'updatedAt',
		type: 'timestamp',
		default: 'now()',
	});
}

export default {
	createPrimaryKeyColumn,
	createCreatedAtColumn,
	createUpdatedAtColumn,
};
