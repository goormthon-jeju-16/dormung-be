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

    const titles = ['첫 모임 후기', '모임 너무 좋아요!', '다음 모임이 기대돼요', '즐거운 시간 보냈어요', '새로운 친구들을 만났어요', '모임 장소 추천합니다', '활동이 정말 알찼어요', '다음 모임 아이디어 있어요', '모임 덕분에 힐링했어요', '참여하길 잘했어요', '모임에서 배운 점', '다음 모임 일정은?', '모임 분위기 최고!', '함께 해서 즐거웠어요', '모임 후기 남깁니다'];
    const contents = [
      '이번 모임 정말 즐거웠습니다. 다음 모임도 기대돼요!',
      '모임에서 많은 것을 배우고 좋은 사람들을 만났어요.',
      '다음 모임이 벌써부터 기다려집니다!',
      '모임 덕분에 새로운 취미를 찾았어요.',
      '참여한 모든 분들께 감사드립니다!',
      '모임 장소가 너무 좋았어요. 다음에도 여기서 했으면 좋겠어요.',
      '활동이 알차고 재미있었어요. 다음 모임도 기대할게요!',
      '모임 아이디어가 정말 신선했어요. 다음에도 좋은 아이디어 부탁드려요.',
      '모임 덕분에 스트레스가 확 풀렸어요. 감사합니다!',
      '참여하길 정말 잘한 것 같아요. 다음 모임도 꼭 참석할게요!',
      '모임에서 얻은 경험이 앞으로 큰 도움이 될 것 같아요.',
      '다음 모임 일정이 궁금해요. 빨리 알려주세요!',
      '모임 분위기가 정말 좋았어요. 모두 친절하고 따뜻했어요.',
      '함께 해서 정말 즐거웠습니다. 다음에도 꼭 함께해요!',
      '모임 후기 남깁니다. 모두 수고 많으셨어요!'
    ];

    meetings.forEach((meeting) => {
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * titles.length);
        const randomUserIndex = Math.floor(Math.random() * 4);
        const board = BoardRepo.create({
          meeting: { id: meeting.id },
          title: titles[randomIndex],
          content: contents[randomIndex],
          user: { id: meeting.meetingUsers[randomUserIndex]?.user?.id || meeting.meetingUsers[0].user.id }
        });
        boards.push(board);
      }
    });

    await BoardRepo.save(boards);
  }
}
