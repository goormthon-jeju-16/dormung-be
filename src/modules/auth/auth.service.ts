import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/constants/roles.enum';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { ConfigService } from '@nestjs/config';
import { Cookies } from 'src/common/constants/cookies.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  // Authorization 헤더에서 토큰 추출
  extractTokenFromHeader(req: any) {
    const accessToken = req.cookies[Cookies.USER_ACCESS_TOKEN];
    return accessToken;
  }

  // JWT 토큰 생성
  private signToken(id: number) {
    const payload = {
      id
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      // expiresIn: isRefresh ? '30d' : '1d'
      expiresIn: '30d'
    });
  }

  // JWT 토큰 검증
  verifyToken(token: string, isRefresh: boolean) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret')
      });

      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError' && !isRefresh) {
        throw new UnauthorizedException(ErrorMessages.EXPIRED_TOKEN);
      }

      throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
    }
  }

  // 토큰 발급
  async generateToken(userId: number) {
    const accessToken = this.signToken(userId);

    return { accessToken };
  }
}
