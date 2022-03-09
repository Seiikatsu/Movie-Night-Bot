import * as fs from 'fs';
import path from 'path';
import { Connection, createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as util from 'util';
import EnvironmentUtils from '../../utils/EnvironmentUtils';

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);

let connection: Connection | undefined;

async function getOptionsFromConfigFile(): Promise<MysqlConnectionOptions> {
	try {
		const configPath = path.join(process.cwd(), 'ormconfig.json');
		if (await exists(configPath)) {
			const content = (await readFile(configPath)).toString();
			return JSON.parse(content) as MysqlConnectionOptions;
		}
	} catch (e) {
		console.error('Error while processing ormconfig.json', e);
	}
	return {} as MysqlConnectionOptions;
}

async function getOrCreateConnection(): Promise<Connection> {
	if (!connection) {
		const mysqlConnectionOptions = {
			...(await getOptionsFromConfigFile()),
			type: 'mariadb',
			migrationsRun: true,
			migrationsTransactionMode: 'each',
			synchronize: EnvironmentUtils.isTest(),
			dropSchema: EnvironmentUtils.isTest(),
		} as MysqlConnectionOptions;
		connection = await createConnection(mysqlConnectionOptions);
	}
	return connection;
}

export default async function getConnection(): Promise<Connection> {
	return getOrCreateConnection();
}
