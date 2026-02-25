import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const adminUsername = this.configService.get('ADMIN_USERNAME') || 'admin';
    const adminPassword = this.configService.get('ADMIN_PASSWORD') || 'admin123';

    if (username !== adminUsername || password !== adminPassword) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { username, sub: 1 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
