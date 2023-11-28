import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';
import { Review, ReviewsResponse } from './models/review';
import { filterReviewWithAI, IResult } from './helpers';
import { ReviewSimilarityService } from './review-text-match';
import { ReviewModel } from './models/review-data-layer';

type ReviewQuery = {
	page?: number;
	limit?: number;
	search?: string;
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low';
	state?: string;
	country?: string;
	city?: string;
	zip?: string;
};

@Injectable()
export class ReviewService {
	constructor(
		private readonly databaseService: DatabaseService,
		private reviewSimilarityService: ReviewSimilarityService,
		private reviewDataLayerService: ReviewModel,
	) {}

	public async get(params: ReviewQuery): Promise<ReviewsResponse> {
		const { page: pageParam, limit: limitParam, search, sort, state, country, city, zip } = params;

		const page = pageParam ? pageParam : 1;
		const limit = limitParam ? limitParam : 25;

		const offset = (page - 1) * limit;

		const sql = this.databaseService.sql;

		let orderBy = sql`id`;
		if (sort === 'az' || sort === 'za') {
			orderBy = sql`landlord`;
		} else if (sort === 'new' || sort === 'old') {
			orderBy = sql`date_added`;
		} else if (sort === 'high' || sort === 'low') {
			orderBy = sql`(repair + health + stability + privacy + respect) / 5`;
		}

		const sortOrder = sort === 'az' || sort === 'old' || sort === 'low' ? sql`ASC` : sql`DESC`;

		const searchClause =
			search?.length > 0
				? sql`AND (landlord ILIKE
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
		const zipClause = zip
			? sql`AND zip =
    ${zip.toUpperCase()}`
			: sql``;

		// Fetch reviews
		const reviews = (await sql`
        SELECT *
        FROM review
        WHERE 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
		AND (flagged = false OR (flagged = true AND admin_approved = true))
        ORDER BY ${orderBy} ${sortOrder} LIMIT ${limit}
        OFFSET ${offset}
    `) as any;

		// Fetch total number of reviews
		const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
    `;
		const total = totalResult[0].count;

		// Fetch countries
		const countries = await sql`
        SELECT DISTINCT country_code
        FROM review;
    `;
		const countryList = countries.map(({ country_code }) => country_code);

		// Fetch states
		const states = await sql`
        SELECT DISTINCT state
        FROM review
        WHERE 1 = 1 ${countryClause};
    `;
		const stateList = states.map(({ state }) => state);

		// Fetch cities
		const cities = await sql`
        SELECT DISTINCT city
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `;
		const cityList = cities.map(({ city }) => city);

		// Fetch zips
		const zips = await sql`
        SELECT DISTINCT zip
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause} ${cityClause};
    `;
		const zipList = zips.map(({ zip }) => zip);

		// Return ReviewsResponse object
		return {
			reviews,
			total,
			countries: countryList,
			states: stateList,
			cities: cityList,
			zips: zipList,
			limit: limit,
		};
	}

	public findOne(id: number): Promise<Review[]> {
		return this.databaseService.sql<Review[]>`Select *
      FROM review
      WHERE id IN (${id});`;
	}

	public async create(inputReview: Review): Promise<Review> {
		try {
			const filterResult: IResult = await filterReviewWithAI(inputReview);

			const existingReviewsForLandlord: Review[] = await this.reviewDataLayerService.getExistingReviewsForLandlord(inputReview);
			const reviewSpamDetected: boolean = await this.reviewSimilarityService.checkReviewsForSimilarity(existingReviewsForLandlord, inputReview.review);
			if (reviewSpamDetected) return inputReview; // Don't post the review to the DB if we detect spam

			return this.reviewDataLayerService.createReview(inputReview, filterResult); // Hit data layer to create review
		} catch (e) {
			throw e;
		}
	}

	public async update(id: number, review: Review): Promise<Review> {
		return this.reviewDataLayerService.update(id, review);
	}

	async report(id: number, reason: string): Promise<number> {
		reason.length > 250 ? (reason = `${reason.substring(0, 250)}...`) : reason;
		await this.databaseService.sql`UPDATE review SET flagged = true, flagged_reason = ${reason}
      WHERE id = ${id};`;

		return id;
	}

	public async delete(id: number): Promise<boolean> {
		await this.databaseService.sql`DELETE
                                   FROM review
                                   WHERE ID = ${id};`;

		return true;
	}

	async getFlagged(): Promise<Review[]> {
		return this.databaseService.sql<Review[]>`SELECT * FROM review WHERE flagged = true;`;
	}

	async getLandlords(): Promise<string[]> {
		const landlords = await this.databaseService.sql`SELECT DISTINCT landlord FROM review;`;
		return landlords.map(({ landlord }) => landlord);
	}

	public async getLandlordReviews(landlord: string): Promise<Review[]> {
		landlord = decodeURIComponent(landlord);

		return this.databaseService.sql<Review[]>`Select *
      FROM review
      WHERE landlord IN (${landlord}) ORDER BY date_added DESC`;
	}

	public async getLandlordSuggestions(landlord: string): Promise<string[]> {
		if (!landlord) return [];
		const suggestions = await this.databaseService.sql`
    SELECT DISTINCT landlord FROM review WHERE landlord LIKE ${'%' + landlord.toLocaleUpperCase() + '%'}
    `;
		return suggestions.map(({ landlord }) => landlord);
	}
}
