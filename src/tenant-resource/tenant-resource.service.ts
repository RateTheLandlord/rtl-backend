import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';
import { Resource, ResourcesResponse } from './models/resource';
import { ResourceModel } from './models/resource-data-layer';

type ResourceQuery = {
	page?: number;
	limit?: number;
	search?: string;
	country?: string;
	state?: string;
	city?: string;
};

@Injectable()
export class TenantResourceService {
	constructor(private readonly databaseService: DatabaseService, private resourceDataLayerService: ResourceModel) {}

	public async get(params: ResourceQuery): Promise<ResourcesResponse> {
		const { page: pageParam, limit: limitParam, search, state, country, city } = params;
		const page = pageParam ? pageParam : 1;
		const limit = limitParam ? limitParam : 25;

		const offset = (page - 1) * limit;

		const sql = this.databaseService.sql;

		const searchClause =
			search?.length > 0
				? sql`AND (name ILIKE
              ${'%' + search + '%'}
              )`
				: sql``;

		const stateClause = state
			? sql`AND state =
    ${state.toUpperCase()}`
			: sql``;
		const countryClause = country
			? sql`AND country_code =
            ${country.toUpperCase()}`
			: sql``;
		const cityClause = city
			? sql`AND city =
    ${city.toUpperCase()}`
			: sql``;

		// Fetch Resources
		const resources = (await sql`
			SELECT * 
			FROM tenant_resource
			WHERE 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} LIMIT ${limit} 
			OFFSET ${offset}
		`) as Array<Resource>;

		// Fetch Total Number of Resources
		const totalResult = await sql`SELECT COUNT(*) as count FROM tenant_resource WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause}`;
		const total = totalResult[0].count;

		//Fetch Countries
		const countries = await sql`SELECT DISTINCT country_code FROM tenant_resource;`;
		const countryList = countries.map(({ country_code }) => country_code);

		const states = await sql`
        SELECT DISTINCT state
        FROM tenant_resource
        WHERE 1 = 1 ${countryClause};
    `;
		const stateList = states.map(({ state }) => state);

		// Fetch cities
		const cities = await sql`
        SELECT DISTINCT city
        FROM tenant_resource
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `;
		const cityList = cities.map(({ city }) => city);

		// Return ResourcesResponse object
		return {
			resources,
			total,
			countries: countryList,
			states: stateList,
			cities: cityList,
			limit: limit,
		};
	}

	public async create(inputResource: Resource): Promise<Resource> {
		try {
			return this.resourceDataLayerService.createResource(inputResource);
		} catch (e) {
			throw e;
		}
	}

	public async update(id: number, resource: Resource): Promise<Resource> {
		return this.resourceDataLayerService.update(id, resource);
	}

	public async delete(id: number): Promise<boolean> {
		await this.databaseService.sql`
			DELETE
			FROM tenant_resource
			WHERE id = ${id};
		`;
		return true;
	}
}
