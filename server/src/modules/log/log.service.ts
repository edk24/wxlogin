import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLog } from './log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(AuthLog)
    private logRepository: Repository<AuthLog>,
  ) {}

  async getLogs(
    page: number = 1,
    pageSize: number = 10,
    projectId?: number,
    userId?: number,
  ) {
    const where: any = {};
    if (projectId) where.project_id = projectId;
    if (userId) where.user_id = userId;

    const [data, total] = await this.logRepository.findAndCount({
      where,
      relations: ['project', 'user'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async getStats() {
    const total = await this.logRepository.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = await this.logRepository
      .createQueryBuilder('log')
      .where('log.created_at >= :today', { today })
      .andWhere('log.created_at < :tomorrow', { tomorrow })
      .getCount();

    return {
      total,
      today: todayCount,
    };
  }
}
