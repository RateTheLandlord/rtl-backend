import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { INTERNAL_SERVER_ERROR, NOT_ACCEPTABLE } from '../auth/constants';
import { TenantResourceService } from './tenant-resource.service';
import { Resource, ResourcesResponse } from './models/resource';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export type ResourceControllerException = {
	statusCode: number;
	message: string | object;
};

@Controller('tenant-resource')
export class TenantResourceController {
	constructor(private readonly resourceService: TenantResourceService) {}

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
		@Query('page') page?: number,
		@Query('limit') limit?: number,
		@Query('search') search?: string,
		@Query('sort') sort?: 'az' | 'za' | 'new' | 'old',
		@Query('state') state?: string,
		@Query('country') country?: string,
		@Query('city') city?: string,
	): Promise<ResourcesResponse> {
		return this.resourceService.get({
			page,
			limit,
			search,
			sort,
			state,
			country,
			city,
		});
	}

	// Create Resource
	@Throttle(2, 10)
	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Body() resource: Resource): Promise<Resource | ResourceControllerException> {
		try {
			const created = await this.resourceService.create(resource);
			return created;
		} catch (e) {
			return this.handleException(e);
		}
	}

	// Update Resource
	@Throttle(5, 60)
	@UseGuards(JwtAuthGuard)
	@Put('/:id')
	async update(@Param('id') id: number, @Body() resource: Resource): Promise<Resource> {
		return this.resourceService.update(id, resource);
	}

	//Delete Resource
	@Throttle(10, 120)
	@UseGuards(JwtAuthGuard)
	@Delete('/:id')
	async delete(@Param('id') id: number): Promise<boolean> {
		return this.resourceService.delete(id);
	}
}
