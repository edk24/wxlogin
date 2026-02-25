import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin/auth')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.adminService.login(body.username, body.password);
  }
}
