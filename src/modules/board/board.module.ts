import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './controllers/board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';
import { BoardReply } from './entities/board-reply.entity';
import { Meeting } from '../meeting/entities/meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Meeting,
      Board,
      BoardReply,
    ])
  ],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
