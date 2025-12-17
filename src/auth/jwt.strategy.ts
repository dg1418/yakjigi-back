import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envVariableKeys } from './jwt.const';
import { UserRepository } from 'src/user/user.repository';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(envVariableKeys.accessTokenSecret),
    });
  }

  async validate(payload: { sub: number | string }) {
    // const user = await this.userRepository.findOneById(+payload.sub);

    // if (!user) {
    //   throw new NotFoundException(
    //     'access 토큰 확인시 유저가 존재하지 않습니다.',
    //   );
    // }

    return payload;
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // ? 옵셔널 을 붙여준 이유는 request 나 cookies 에 값이 없을때
          // null 을 반환하여 서버 종료를 방지하기 위함
          return request?.cookies?.refreshToken || null;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get<string>(
        envVariableKeys.refreshTokenSecret,
      ),
    });
  }

  async validate(request: Request, payload: { sub: number | string }) {
    const refreshToken = request?.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No Refresh Token provided');
    }

    // const user = await this.userRepository.findOneById(+payload.sub);

    // if (!user) {
    //   throw new NotFoundException(
    //     'access 토큰 확인시 유저가 존재하지 않습니다.',
    //   );
    // }

    return payload;
  }
}
