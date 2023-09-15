import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import * as fs from 'fs';

const environment = process.env.ENVIRONMENT as string;

@Injectable()
export class DatabaseService {
	sql =
		environment === 'production'
			? postgres(process.env.PGURL as string, {
					ssl: {
						ca: [fs.readFileSync('./src/database/ca-certificate.crt')],
					},
			  })
			: postgres();
}
