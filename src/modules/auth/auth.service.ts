import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/constants/roles.enum';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Authorization 헤더에서 토큰 추출
  extractTokenFromHeader(req: any) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.split(' ')[1];
  }

  // JWT 토큰 생성
  private signToken(id: number, role: Role, isRefresh: boolean = false) {
    const payload = {
      id,
      role
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      // expiresIn: isRefresh ? '30d' : '15m'
      expiresIn: isRefresh ? '30d' : '1d'
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
  async generateToken(userId: number, role: Role) {
    const accessToken = this.signToken(userId, role);
    const refreshToken = this.signToken(userId, role, true);

    return { accessToken, refreshToken };
  }

  // 토큰 갱신
  async rotateToken(oldRefreshToken: string) {
    const payload = this.verifyToken(oldRefreshToken, true);

    const now = Math.floor(Date.now() / 1000);
    const timeToExpire = payload.exp - now;

    const accessToken = this.signToken(payload.id, payload.role);
    let newRefreshToken = '';
    if (timeToExpire < 24 * 60 * 60) {
      newRefreshToken = this.signToken(payload.id, payload.role, true);
    }

    return { accessToken, newRefreshToken };
  }

  // 비밀번호 해싱
  async hashPassword(plainPassword: string) {
    const hashRounds = this.configService.get('jwt.hashRounds', 10);
    const hashedPassword = await bcrypt.hash(plainPassword, hashRounds);

    return hashedPassword;
  }

  // 비밀번호 검증
  async comparePassword(plainPassword: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessages.NOT_FOUND_USER);
    }

    return true;
  }
}
