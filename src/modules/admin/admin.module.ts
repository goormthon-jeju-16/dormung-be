import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminJwtAuthGuard } from 'src/common/guards/admin-auth.guard';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    AuthModule,
    UserModule,
  ],
  controllers: [
    AdminController,
  ],
  providers: [
    AdminService,
    {
      provide: APP_GUARD,
      useClass: AdminJwtAuthGuard
    }
  ]
})
export class AdminModule {}
