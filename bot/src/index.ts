/* eslint-disable import/newline-after-import,@typescript-eslint/no-var-requires,import/first */
require('dotenv')
	.config();
import 'reflect-metadata';

// ensure sources are loaded!
import './djs';
import DJSClient from './djs/DJSClient';
import StartupAction, { StartupActionSymbol } from './interfaces/StartupAction';
import { IOCManager } from './ioc/IOCManager';
import './service';
import PrioritySorter from './utils/PrioritySorter';

(async () => {
	const globalContainer = IOCManager.INSTANCE;
	await globalContainer.executeInRequestScope(async (container) => {
		// now run all startup jobs
		const startupActions = container.getAll<StartupAction>(StartupActionSymbol);
		await Promise.all( //
			startupActions.sort(PrioritySorter) //
				.map((a) => Promise.resolve(a.onStartup())),
		);
	});
	const client = globalContainer.get(DJSClient);
	await client.start();
})();
