import { Module } from '@nestjs/common';
import { CaptchaModule } from 'src/captcha/captcha.module';
import { DatabaseService } from 'src/database/database.service';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewSimilarityService } from './review-text-match';
import { ReviewModel } from './models/review-data-layer';
import { GoogleStrategy } from 'src/auth/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [CaptchaModule, ConfigModule.forRoot(), PassportModule.register({ defaultStrategy: 'google' })],
	controllers: [ReviewController],
	providers: [ReviewService, DatabaseService, ReviewSimilarityService, ReviewModel, GoogleStrategy],
	exports: [ReviewService],
})
export class ReviewModule {}
