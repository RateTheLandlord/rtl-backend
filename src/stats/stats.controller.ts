import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export type ResourceControllerException = {
	statusCode: number;
	message: string | object;
};

@Controller('stats')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	@Throttle(5, 60)
	@UseGuards(JwtAuthGuard)
	@Get()
	get(@Query('startDate') startDate?: string, @Query('groupBy') groupBy?: string): Promise<any> {
		return this.statsService.get({
			startDate,
			groupBy,
		});
	}
}
