import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Board } from 'src/modules/board/entities/board.entity';
import { BoardReply } from 'src/modules/board/entities/board-reply.entity';

export class BoardSeeder implements Seeder {
  static priority = 4;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const BoardReplyRepo = dataSource.getRepository(BoardReply);

    const findBoardReplies = await BoardReplyRepo.find();
    if (findBoardReplies.length) {
      return;
    }

    // board 조회
    const boardRepo = dataSource.getRepository(Board);
    const boards = await boardRepo.find({
      select: {
        id: true,
        user: {
          id: true
        }
      },
      relations: {
        user: true
      }
    });

    const replies = ['반갑습니다!', '다음 모임도 기대됩니다.', '좋은 정보 감사합니다.', '모임 분위기가 너무 좋았어요!', '새로운 친구들을 만나서 즐거웠습니다.'];

    const boardReplies: BoardReply[] = [];

    boards.forEach((board) => {
      const randomIndex = Math.floor(Math.random() * replies.length);
      const boardReply = BoardReplyRepo.create({
        board: { id: board.id },
        reply: replies[randomIndex],
        user: { id: board.user.id }
      });
      boardReplies.push(boardReply);
    });

    await BoardReplyRepo.save(boardReplies);
  }
}
