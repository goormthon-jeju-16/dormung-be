import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JwtModule.register({}),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
