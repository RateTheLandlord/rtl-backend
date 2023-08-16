import { BadRequestException, Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { INTERNAL_SERVER_ERROR, NOT_ACCEPTABLE } from '../auth/constants'
import { ResourceService } from './resource.service'

export type ResourceControllerException = {
	statusCode: number
	message: string | object
}

@Controller('resource')
export class ResourceController {
	constructor(private readonly resourceService: ResourceService) {}
	private handleException(e: BadRequestException | HttpException | unknown): never {
		if (e instanceof BadRequestException) {
			throw new HttpException(NOT_ACCEPTABLE, HttpStatus.NOT_ACCEPTABLE)
		} else {
			throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	@Throttle(5, 60)
	@Get()
	get(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
		@Query('search') search?: string,
		@Query('state') state?: string,
		@Query('country') country?: string,
		@Query('city') city?: string,
	): Promise<ResourceResponse> {
		return this.resourceService.get({
			page,
			limit,
			search,
			state,
			country,
			city,
		})
	}
}