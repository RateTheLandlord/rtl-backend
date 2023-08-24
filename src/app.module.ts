import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CaptchaModule } from './captcha/captcha.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PasswordModule } from './password/password.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ResourceModule } from './resource/resource.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot({
			ttl: 100,
			limit: 10,
		}),
		ReviewModule,
		CaptchaModule,
		AuthModule,
		UserModule,
		PasswordModule,
		ResourceModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}