import { Controller, Get } from '@nestjs/common';
import { UserService } from '../user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { Public } from 'src/common/decorators/auth-public.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get('test')
  async testI() {
    return 'User Controller Test Success';
  }
}
