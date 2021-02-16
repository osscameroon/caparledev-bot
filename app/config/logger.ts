import * as fs from 'fs';
import path from 'path';
import bunyan from 'bunyan';
// @ts-ignore
import * as Logger from '@types/bunyan';

import * as config from '../config';

const logFileDir: string | undefined = config.LOG_FILE_DIR;
const dir: string = logFileDir ? path.join(__dirname, logFileDir) : '../../logs';

// Create the logs folder if not exists
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

const logger: Logger = bunyan.createLogger({
	 name: 'caparledev',
	 streams: [{
		 type: 'rotating-file',
		 path: `${dir}/app.log`,
		 period: '1d',   // daily rotation
		 count: 5, // keep 3 back copies
	 }, { // Log message in the console
		 level : 'debug',
		 stream : process.stdout,
	 }],
 });

export { logger };
