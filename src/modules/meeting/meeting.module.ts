import { Module } from '@nestjs/common';
import { MeetingController } from './controllers/meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingCategory } from './entities/meeting-category.entity';
import { User } from '../user/entities/user.entity';
import { Meeting } from './entities/meeting.entity';
import { MeetingUser } from './entities/meeting-user.entity';
import { OpenaiModule } from 'src/services/openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingCategory,
      User,
      Meeting,
      MeetingUser,
    ]),
    OpenaiModule
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService]
})
export class MeetingModule {}
