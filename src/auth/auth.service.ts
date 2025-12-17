import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SocialUser } from './social-user.interface';
import { ConfigService } from '@nestjs/config';
import { envVariableKeys } from './jwt.const';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async kakaoLogin(user: SocialUser) {
    let appUser = await this.userRepository.findOneByProviderId(
      user.providerId,
    );

    if (!appUser) {
      const data: CreateUserDto = {
        providerId: user.providerId,
        name: user.name,
      };
      appUser = await this.userRepository.create(data);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.issueToken(appUser, false),
      this.issueToken(appUser, true),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async issueToken(user: { id: number }, isRefreshToken: boolean) {
    const refreshTokenSecret = this.configService.get<string>(
      envVariableKeys.refreshTokenSecret,
    );

    const accessTokenSecret = this.configService.get<string>(
      envVariableKeys.accessTokenSecret,
    );

    return this.jwtService.signAsync(
      {
        sub: user.id,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefreshToken ? '24h' : 300,
      },
    );
  }
}
