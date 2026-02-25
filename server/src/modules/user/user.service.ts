import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(page: number = 1, pageSize: number = 10, keyword?: string) {
    const where = keyword
      ? [
          { nickname: Like(`%${keyword}%`) },
          { openid: Like(`%${keyword}%`) },
        ]
      : {};

    const [data, total] = await this.userRepository.findAndCount({
      where,
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

  async getUser(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
