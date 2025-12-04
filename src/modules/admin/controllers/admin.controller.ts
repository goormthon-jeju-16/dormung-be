import { Body, Controller, Post, Req } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { Role } from 'src/common/constants/roles.enum';
import { Public } from 'src/common/decorators/auth-public.decorator';
import type { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginAdminDto } from '../dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  // 관리자 로그인
  @Public()
  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    const { loginId, password } = loginAdminDto;
    const findAdmin = await this.adminService.getAdminByLoginId(loginId);
    await this.authService.comparePassword(password, findAdmin.password);

    return await this.authService.generateToken(findAdmin.id, Role.ADMIN);
  }

  // 토큰 갱신
  @Public()
  @Post('token/refresh')
  async refreshToken(@Req() req: Request) {
    const refreshToken = this.authService.extractTokenFromHeader(req);

    return await this.authService.rotateToken(refreshToken);
  }
}
