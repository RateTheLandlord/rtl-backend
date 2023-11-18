import { Injectable } from '@nestjs/common';
import { IUser } from './models/types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
	constructor(private readonly databaseService: DatabaseService) {}

	async deleteUser(id: number): Promise<boolean> {
		await this.databaseService.sql`DELETE FROM users WHERE ID = ${id}`;

		return true;
	}

	async update(id: number, user: IUser): Promise<boolean> {
		await this.databaseService.sql`UPDATE users SET name = ${user.name}, email= ${user.email} WHERE id = ${id}`;

		return true;
	}

	async getAll(): Promise<IUser[]> {
		return this.databaseService.sql<IUser[]>`Select * FROM users`;
	}

	async create(user: IUser): Promise<IUser> {
		const id = (
			await this.databaseService.sql<{ id: number }[]>`
        INSERT INTO users (name, email, role) VALUES ( ${user.name}, ${user.email}, ${user.role}) RETURNING id
        ;`
		)[0].id;
		user.id = id;
		return user;
	}
}
