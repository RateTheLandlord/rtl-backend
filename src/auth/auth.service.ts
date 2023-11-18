import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async createToken(user: any): Promise<string> {
		const payload = { sub: user.googleId, email: user.email }; // Customize the payload as needed
		return await this.jwtService.signAsync(payload);
	}
}
