import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

type StatsQuery = {
	startDate: string;
	endDate: string;
	country?: string;
	state?: string;
	city?: string;
	zip?: string;
};

@Injectable()
export class StatsService {
	constructor(private readonly databaseService: DatabaseService) {}

	public async get(params: StatsQuery): Promise<any> {
    const { startDate, endDate, country, state, city, zip } = params;
    const sql = this.databaseService.sql;
  
    const DEFAULT_END = new Date();
    const DEFAULT_START = dayjs(DEFAULT_END).subtract(7, 'days');
  
    let dateRange = sql`${DEFAULT_START.toISOString()} AND ${DEFAULT_END.toISOString()}`;
    if (startDate && endDate) {
      dateRange = sql`${dayjs(startDate)} AND ${dayjs(endDate)}`;
    }
  
    const reviewsStatistics = await sql`
      WITH ReviewStats AS (
        SELECT
          date_added::DATE AS review_date,
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
          review_date,
          country_code,
          city,
          state,
          zip
      )
  
      SELECT
        review_date,
        jsonb_object_agg(country_code, review_count) AS country_codes,
        jsonb_object_agg(city, review_count) AS cities,
        jsonb_object_agg(zip, review_count) AS zips,
        jsonb_object_agg(state, review_count) AS states
      FROM
        ReviewStats
      GROUP BY
        review_date;
    `;
  
    const formattedReviews = reviewsStatistics.map((row) => ({
      date: row.review_date,
      country_codes: row.country_codes || {},
      cities: row.cities || {},
      state: row.states || {},
      zip: row.zips || {},
    }));
  
    return formattedReviews;
  }
  
}
