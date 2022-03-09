import StartupAction, { StartupActionSymbol } from '../../interfaces/StartupAction';
import { singleton } from '../../ioc';
import getConnection from '../utils/getConnection';

@singleton(StartupActionSymbol)
class MigrationStartupAction implements StartupAction {
	public readonly priority = -1000;

	async onStartup(): Promise<void> {
		await getConnection();
	}
}
