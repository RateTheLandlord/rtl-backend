import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CaptchaModule } from './captcha/captcha.module';
import { ReviewModule } from './review/review.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TenantResourceModule } from './tenant-resource/tenant-resource.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { StatsModule } from './stats/stats.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot({
			ttl: 100,
			limit: 10,
		}),
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '7d' },
		}),
		ReviewModule,
		CaptchaModule,
		AuthModule,
		UserModule,
		TenantResourceModule,
		StatsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
