import { Injectable } from '@nestjs/common';
import postgres from 'postgres';

const environment = process.env.ENVIRONMENT as string;

@Injectable()
export class DatabaseService {
	sql = environment === 'production' ? postgres(process.env.PGURL as string) : postgres();
}
