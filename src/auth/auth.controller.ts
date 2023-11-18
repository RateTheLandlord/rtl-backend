// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service'; // Create AuthService as needed
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	googleLogin() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleLoginCallback(@Req() req, @Res() res) {
		const { user } = req;
		const allUsers = await this.userService.getAll();
		const isAllowedEmail = allUsers.some((obj) => obj.email === user.email);
		if (!isAllowedEmail) {
			return res.redirect(`http://localhost:3000/`);
		}
		const token = await this.authService.createToken(user); // Implement createToken in your AuthService
		return res.redirect(`http://localhost:3000/login?name=${encodeURIComponent(user.name)}&token=${token}`);
	}
}
