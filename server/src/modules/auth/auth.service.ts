import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WechatService } from './wechat.service';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { AuthLog } from '../log/log.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AuthLog)
    private logRepository: Repository<AuthLog>,
    private wechatService: WechatService,
  ) {}

  // 获取项目信息
  async getProject(appId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { app_id: appId, status: 1 }
    });
    if (!project) {
      throw new Error('项目不存在或已禁用');
    }
    return project;
  }

  // 生成微信授权URL
  async generateAuthUrl(appId: string, redirectUri: string, scope: string, state: string): Promise<string> {
    const project = await this.projectRepository.findOne({ where: { app_id: appId, status: 1 } });
    if (!project) {
      throw new Error('项目不存在或已禁用');
    }

    const wechatAppId = process.env.WECHAT_APPID;
    const callbackUrl = new URL(`${process.env.BASE_URL || 'http://localhost:3000'}/oauth/callback`);
    callbackUrl.searchParams.set('app_id', appId);
    callbackUrl.searchParams.set('redirect_uri', redirectUri);
    callbackUrl.searchParams.set('scope', scope);
    const encodedRedirect = encodeURIComponent(callbackUrl.toString());

    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatAppId}&redirect_uri=${encodedRedirect}&response_type=code&forcePopup=true&scope=${scope}&state=${state}#wechat_redirect`;
  }

  // 处理微信回调
  async handleCallback(code: string, stateData: any) {
    // 直接使用传入的stateData对象
    const { appId, redirect, scope } = stateData;

    // 获取项目信息
    const project = await this.projectRepository.findOne({ where: { app_id: appId } });
    if (!project) {
      throw new Error('项目不存在');
    }

    // 通过code换取access_token
    const tokenData = await this.wechatService.getOAuthAccessToken(code);
    const { access_token, openid } = tokenData;

    // 保存或更新用户信息
    let user = await this.userRepository.findOne({ where: { openid } });

    if (scope === 'snsapi_userinfo') {
      const userInfo = await this.wechatService.getUserInfo(access_token, openid);
      if (user) {
        user.nickname = userInfo.nickname;
        user.avatar = userInfo.headimgurl;
        user.sex = userInfo.sex;
        user.province = userInfo.province;
        user.city = userInfo.city;
        user.country = userInfo.country;
        user.last_auth_time = new Date();
      } else {
        user = this.userRepository.create({
          openid,
          unionid: userInfo.unionid,
          nickname: userInfo.nickname,
          avatar: userInfo.headimgurl,
          sex: userInfo.sex,
          province: userInfo.province,
          city: userInfo.city,
          country: userInfo.country,
          first_auth_time: new Date(),
          last_auth_time: new Date(),
        });
      }
    } else {
      if (!user) {
        user = this.userRepository.create({
          openid,
          first_auth_time: new Date(),
          last_auth_time: new Date(),
        });
      } else {
        user.last_auth_time = new Date();
      }
    }

    await this.userRepository.save(user);

    // 记录授权日志
    const log = this.logRepository.create({
      project_id: project.id,
      openid,
      scope,
    });
    await this.logRepository.save(log);

    // 返回用户信息
    return {
      redirect: redirect,
      openid: user.openid,
      nickname: user.nickname || '',
      avatar: user.avatar || '',
      sex: user.sex || 0,
      state: stateData.state || '',
    };
  }
}
