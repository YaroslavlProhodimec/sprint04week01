import { Controller, Get, Post, Delete, Query, Param, Body, HttpStatus, HttpCode, NotFoundException } from '@nestjs/common';
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: { login: string; email: string; password: string }) {
    return this.usersService.createUser(body.login, body.email, body.password);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const deleted = await this.usersService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}