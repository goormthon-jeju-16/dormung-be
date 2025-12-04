import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UserJwtAuthGuard } from 'src/common/guards/user-auth.guard';
import { UserPreferredCategory } from '../meeting/entities/user-preferred-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPreferredCategory
    ]),
    AuthModule
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: UserJwtAuthGuard
    }
  ],
  exports: [UserService]
})
export class UserModule {}
