import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import ley from 'ley';
import requestIp from 'request-ip';
import { createAdminUser } from './user/create-initial-user';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	await ley.up({
		cwd: './src/database/',
		dir: 'migrations',
		driver: 'postgres',
	});

	app.use(requestIp.mw());
	app.enableCors({
		origin: process.env.CORS_ORIGIN,
	});
	await createAdminUser();
	await app.listen(process.env.PORT);
}
bootstrap();
