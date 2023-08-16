import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';

type ResourceQuery = {
	page?: number;
	limit?: number;
	search?: string;
	country?: string;
	state?: string;
	city?: string;
};

@Injectable()
export class ResourceService {
	constructor(private readonly databaseService: DatabaseService) {}

	public async get(params: ResourceQuery): Promise<ResourceResponse> {
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
			SELECT * FROM resource WHERE 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} LIMIT ${limit} OFFSET ${offset}
		`) as any;

		// Fetch Total Number of Resources
		const totalResult = await sql`SELECT COUNT(*) as count FROM resource WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause}`;
		const total = totalResult[0].count;

		//Fetch Countries
		const countries = await sql`SELECT DISTINCT country_code FROM resource;`;
		const countryList = countries.map(({ country_code }) => country_code);
	}
}