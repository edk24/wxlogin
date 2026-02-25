import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WechatService } from './wechat.service';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { AuthLog } from '../log/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, AuthLog])],
  controllers: [AuthController],
  providers: [AuthService, WechatService],
})
export class AuthModule {}
