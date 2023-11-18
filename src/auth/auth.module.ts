import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { UserService } from 'src/user/user.service';
import { DatabaseService } from 'src/database/database.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		ConfigModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '7d' },
		}),
		PassportModule,
	],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy, UserService, DatabaseService, JwtStrategy],
})
export class AuthModule {}
