/* eslint-disable import/newline-after-import,@typescript-eslint/no-var-requires,import/first */
require('dotenv')
	.config();
import 'reflect-metadata';
import StartupAction, { StartupActionSymbol } from './interfaces/StartupAction';
import { IOCManager } from './ioc/IOCManager';
import PrioritySorter from './utils/PrioritySorter';

// ensure sources are loaded!
import './djs';
import './service';

(async () => {
	// now run all startup jobs
	const startupActions = IOCManager.INSTANCE.getAll<StartupAction>(StartupActionSymbol);
	await Promise.all( //
		startupActions.sort(PrioritySorter) //
			.map((a) => Promise.resolve(a.onStartup())),
	);
})();
