import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { LogService } from './log.service';

@Controller('admin/logs')
@UseGuards(JwtAuthGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async getLogs(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('projectId') projectId?: number,
    @Query('userId') userId?: number,
  ) {
    return this.logService.getLogs(page, pageSize, projectId, userId);
  }

  @Get('stats')
  async getStats() {
    return this.logService.getStats();
  }
}
