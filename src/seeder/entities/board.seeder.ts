import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Board } from 'src/modules/board/entities/board.entity';

export class BoardSeeder implements Seeder {
  static priority = 3;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const BoardRepo = dataSource.getRepository(Board);

    const findBoards = await BoardRepo.find();
    if (findBoards.length) {
      return;
    }

    const boards: Board[] = [];

    // meeting 조회
    const meetingRepo = dataSource.getRepository('Meeting');
    const meetings = await meetingRepo.find({
      select: {
        id: true,
        meetingUsers: {
          id: true,
          user: {
            id: true
          }
        }
      },
      relations: {
        meetingUsers: {
          user: true
        }
      }
    });

    const titles = ['첫 모임 후기', '모임 너무 좋아요!', '다음 모임이 기대돼요', '즐거운 시간 보냈어요', '새로운 친구들을 만났어요'];
    const contents = ['이번 모임 정말 즐거웠습니다. 다음 모임도 기대돼요!', '모임에서 많은 것을 배우고 좋은 사람들을 만났어요.', '다음 모임이 벌써부터 기다려집니다!', '모임 덕분에 새로운 취미를 찾았어요.', '참여한 모든 분들께 감사드립니다!'];

    meetings.forEach((meeting) => {
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * titles.length);
        const board = BoardRepo.create({
          meeting: { id: meeting.id },
          title: titles[randomIndex],
          content: contents[randomIndex],
          user: { id: meeting.meetingUsers.length > i ? meeting.meetingUsers[i].user.id : meeting.meetingUsers[0].user.id }
        });
        boards.push(board);
      }
    });

    await BoardRepo.save(boards);
  }
}
