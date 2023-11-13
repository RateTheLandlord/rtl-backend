import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CaptchaModule } from './captcha/captcha.module';
import { ReviewModule } from './review/review.module';
import { AppController } from './app.controller';
import { PasswordModule } from './password/password.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TenantResourceModule } from './tenant-resource/tenant-resource.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot({
			ttl: 100,
			limit: 10,
		}),
		ReviewModule,
		CaptchaModule,
		PasswordModule,
		TenantResourceModule,
		JwtModule.register({
			secret: process.env.JWT_KEY, // Set your secret key
			signOptions: { expiresIn: '7d' }, // Set the expiration time
		}),
	],
	controllers: [AppController, AuthController],
	providers: [],
})
export class AppModule {}
