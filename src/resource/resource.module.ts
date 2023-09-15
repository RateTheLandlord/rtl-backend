import { Module } from '@nestjs/common';
import { CaptchaModule } from 'src/captcha/captcha.module';
import { DatabaseService } from 'src/database/database.service';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { ResourceModel } from './models/resource-data-layer';

@Module({
	imports: [CaptchaModule],
	controllers: [ResourceController],
	providers: [ResourceService, DatabaseService, ResourceModel],
	exports: [ResourceService],
})
export class ResourceModule {}
