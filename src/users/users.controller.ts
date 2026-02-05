import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: any) {
    const sortData = {
      searchNameTerm: query.searchNameTerm,
      searchEmailTerm: query.searchEmailTerm,
      searchLoginTerm: query.searchLoginTerm,
      loginOrEmail: query.loginOrEmail,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    };

    return this.usersService.getAllUsers(sortData);
  }
}