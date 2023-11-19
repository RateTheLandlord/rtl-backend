import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
	controllers: [StatsController],
	providers: [StatsService, DatabaseService],
	exports: [StatsService],
})
export class StatsModule {}
