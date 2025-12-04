import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from '../user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import express from 'express';
import { Cookies } from 'src/common/constants/cookies.enum';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  // 거주기간 조회
  @Public()
  @Get('residence-period/list')
  async getResidencePeriodList() {
    return this.userService.getResidencePeriodList();
  }

  // 거주지역 조회
  @Public()
  @Get('residence-area/list')
  async getResidenceAreaList() {
    return this.userService.getResidenceAreaList();
  }

  // 유저 회원가입
  @Public()
  @Post('join')
  async join(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: express.Response) {
    const accessToken = await this.userService.createUser(createUserDto);

    res.cookie(Cookies.USER_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return true;
  }

  // 유저 정보 조회
  @Public()
  @Get('/info')
  async getUserInfo(@AuthUser() user: User) {
    return this.userService.getUserInfo(user);
  }
}
