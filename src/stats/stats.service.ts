import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

type StatsQuery = {
	startDate?: string;
};

@Injectable()
export class StatsService {
	constructor(private readonly databaseService: DatabaseService) {}

	public async get(params: StatsQuery): Promise<any> {
		const { startDate } = params;
		const sql = this.databaseService.sql;

		const DEFAULT_START = dayjs(new Date()).subtract(7, 'days').format('YYYY-MM-DD');
		const dateRange = startDate ? sql`${dayjs(startDate).toISOString()} AND NOW()` : sql`${DEFAULT_START} AND NOW()`;

		const reviewsStatistics = await this.getReviewStatistics(dateRange);
		const reviewByDate = await this.getReviewByDate(dateRange);

		const formattedReviews = reviewsStatistics.map((row) => ({
			date: row.date,
			country_codes: row.country_codes || {},
			cities: row.cities || {},
			state: row.states || {},
			zip: row.zips || {},
		}));

		const detailed_stats = startDate
			? this.combineArrays(this.combineObjectsByMonth(formattedReviews), this.combineObjectsByMonth(reviewByDate))
			: this.combineArrays(formattedReviews, reviewByDate);

		const totalStats = await this.getTotalStats();

		return { detailed_stats, total_stats: totalStats };
	}

	private async getReviewStatistics(dateRange: any) {
		const sql = this.databaseService.sql;

		return sql`
      WITH ReviewStats AS (
        SELECT
          date_added::DATE AS date,
          country_code,
          city,
          state,
          zip,
          COUNT(*) AS review_count
        FROM
          review
        WHERE
          date_added BETWEEN ${dateRange}
        GROUP BY
          date,
          country_code,
          city,
          state,
          zip
      )
  
      SELECT
        date,
        jsonb_object_agg(country_code, review_count) AS country_codes,
        jsonb_object_agg(city, review_count) AS cities,
        jsonb_object_agg(zip, review_count) AS zips,
        jsonb_object_agg(state, review_count) AS states
      FROM
        ReviewStats
      GROUP BY
        date;
    `;
	}

	private async getReviewByDate(dateRange: any) {
		const sql = this.databaseService.sql;

		return sql`
      SELECT
        date_added::date AS date,
        COUNT(*) AS total
      FROM
        review
      WHERE
        date_added BETWEEN ${dateRange}
      GROUP BY
        date_added::date
      ORDER BY
        date_added::date;
    `;
	}

	combineObjectsByMonth = (array) => {
		const resultArray = [];

		array.forEach((obj) => {
			const { date, ...rest } = obj;
			const month = dayjs(date).month(); // Extract 'YYYY-MM' from the date

			// Find existing entry for the month or create a new one
			const existingEntry = resultArray.find((entry) => entry.month === month);

			if (existingEntry) {
				// Update existing entry by summing numerical values
				Object.keys(rest).forEach((key) => {
					existingEntry[key] = (existingEntry[key] || 0) + obj[key];
				});
			} else {
				// Create a new entry for the month
				const newEntry = { month, ...rest };
				resultArray.push(newEntry);
			}
		});

		return resultArray;
	};

	combineArrays = (reviewStats, reviews) => {
		return reviewStats.map((reviewStat) => {
			const correspondingReview = reviews.find((review) => review.month === reviewStat.month);
			return { ...reviewStat, ...correspondingReview };
		});
	};

	private async getTotalStats(): Promise<any> {
		const sql = this.databaseService.sql;

		const getReviewStats = async (countryCode: string): Promise<{ total: number; states: { key: string; total: number }[] }> => {
			const totalResult = await sql`SELECT COUNT(*) as count FROM review WHERE country_code = ${countryCode}`;
			const total_reviews = totalResult[0].count;

			const statesResult = await sql`SELECT DISTINCT state FROM review WHERE country_code = ${countryCode}`;
			const states_list = statesResult.map(({ state }) => state);

			const total_for_states = [];

			for (let i = 0; i < states_list.length; i++) {
				const key = states_list[i];
				const total = await sql`SELECT COUNT(*) as count FROM review WHERE state = ${states_list[i]}`;
				total_for_states.push({ key: key, total: total[0].count });
			}

			return { total: total_reviews, states: total_for_states };
		};

		const distinctCountryCodes = await sql`SELECT DISTINCT country_code FROM review`;

		const countryStatsPromises = distinctCountryCodes.map(async ({ country_code }) => {
			return {
				[country_code]: await getReviewStats(country_code),
			};
		});

		const countryStats = await Promise.all(countryStatsPromises);

		return {
			total_reviews: (await sql`SELECT COUNT(*) as count FROM review`)[0].count,
			countryStats: Object.assign({}, ...countryStats),
		};
	}
}
