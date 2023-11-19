import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { INTERNAL_SERVER_ERROR, NOT_ACCEPTABLE } from '../auth/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatsService } from './stats.service';

export type ResourceControllerException = {
	statusCode: number;
	message: string | object;
};

@Controller('stats')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	private handleException(e: BadRequestException | HttpException | unknown): never {
		if (e instanceof BadRequestException) {
			throw new HttpException(NOT_ACCEPTABLE, HttpStatus.NOT_ACCEPTABLE);
		} else {
			throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Throttle(5, 60)
	@Get()
	get(
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('state') state?: string,
		@Query('country') country?: string,
		@Query('city') city?: string,
		@Query('zip') zip?: string,
	): Promise<any> {
		return this.statsService.get({
			startDate,
			endDate,
			zip,
			state,
			country,
			city,
		});
	}
}
