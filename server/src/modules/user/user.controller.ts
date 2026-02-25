import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.userService.getUsers(page, pageSize, keyword);
  }

  @Get(':id')
  async getUser(@Query('id') id: number) {
    return this.userService.getUser(id);
  }
}
