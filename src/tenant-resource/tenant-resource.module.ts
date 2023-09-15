import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TenantResourceController } from './tenant-resource.controller';
import { TenantResourceService } from './tenant-resource.service';
import { ResourceModel } from './models/resource-data-layer';

@Module({
	controllers: [TenantResourceController],
	providers: [TenantResourceService, DatabaseService, ResourceModel],
	exports: [TenantResourceService],
})
export class TenantResourceModule {}
