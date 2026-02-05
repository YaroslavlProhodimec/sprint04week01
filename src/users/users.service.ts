import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(sortData: any) {
    return this.usersRepository.getAllUsers(sortData);
  }

  async createUser(login: string, email: string, password: string) {
    return this.usersRepository.createUser(login, email, password);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }
}