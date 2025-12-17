import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SocialUser } from './social-user.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(
    @Req() req: { user: SocialUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.kakaoLogin(
      req.user,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true, // TODO: HTTPS 적용 시 주석 해제
      sameSite: 'strict',
    });

    // 프론트엔드 메인 페이지로 리다이렉트하면서 accessToken을 쿼리 파라미터로 전달
    res.redirect(`http://localhost/?accessToken=${accessToken}`);
  }

  @Get('access-token/refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: { payload: { sub: number | string } }) {
    const user = {
      id: +req.payload.sub,
    };

    return {
      accessToken: await this.authService.issueToken(user, false),
    };
  }
}
