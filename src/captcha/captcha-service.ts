import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { INVALID_CAPTCHA } from '../auth/constants';

interface IRes {
	valid: boolean;
}

@Injectable()
export class CaptchaService {
	VERIFY_URL = 'https://captcha.ratethelandlord.org/api/v1/pow/siteverify';

	constructor(private readonly httpService: HttpService) {}

	async verifyToken(token: string): Promise<boolean> {
		const data = {
			token: token,
			key: process.env.MCAPTCHA_SITE_KEY,
			secret: process.env.MCAPTCHA_SECRET_KEY,
		};

		const req = await fetch(this.VERIFY_URL, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(data),
		});

		const res: IRes = await req.json();

		if (res.valid === false) {
			throw new BadRequestException(INVALID_CAPTCHA);
		}
		return true;

		// const resp = await this.httpService.axiosRef.post(this.VERIFY_URL, {
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	},
		// });
		// Object.keys(data).forEach((key: string) => data[key] === undefined && delete data[key]);

		// const response = await this.httpService.axiosRef.post(this.VERIFY_URL, new URLSearchParams(data), {
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	},
		// });
		// const success: boolean = response.data?.success;
		// if (!success) throw new BadRequestException(INVALID_CAPTCHA);
		// return true;
	}
}
