// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.get('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
			callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
			passReqToCallback: true,
			scope: ['profile', 'email'],
		});
	}

	async validate(_request: any, _accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		const { id, emails, displayName } = profile;
		const user = {
			googleId: id,
			email: emails[0].value,
			name: displayName,
		};
		done(null, user);
	}
}
