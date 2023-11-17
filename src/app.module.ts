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

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot({
			ttl: 100,
			limit: 10,
		}),
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '1h' },
		}),
		ReviewModule,
		CaptchaModule,
		AuthModule,
		UserModule,
		TenantResourceModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
