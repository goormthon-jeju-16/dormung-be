import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

export class UserSeeder implements Seeder {
  static priority = 2;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepo = dataSource.getRepository(User);

    const findUser = await userRepo.find();
    if (findUser.length) {
      return;
    }

    const users = [
      {
        residenceArea: '연동',
        nickname: '바람결',
        residencePeriod: '6개월 미만',
        introduceSelf: '전시 보러 다니고 사람 만나는 걸 좋아해요.',
        profileImagePath: 'public/dori-1.png'
      },
      {
        residenceArea: '이도',
        nickname: '해초리',
        residencePeriod: '단기 체류 중',
        introduceSelf: '제주 생활 꿀팁 나누는 거 좋아해요!',
        profileImagePath: 'public/dori-2.png'
      },
      {
        residenceArea: '애월',
        nickname: 'Sora',
        residencePeriod: '6개월 미만',
        introduceSelf: '운동과 공방 탐방하는 게 취미예요.',
        profileImagePath: 'public/dori-3.png'
      },
      {
        residenceArea: '한림',
        nickname: '돌하르',
        residencePeriod: '단기 체류 중',
        introduceSelf: '안녕하세요, 저는 한림에 거주하는 돌하르입니다.',
        profileImagePath: 'public/dori-1.png'
      },
      {
        residenceArea: '함덕',
        nickname: '한결',
        residencePeriod: '3년 이상~',
        introduceSelf: '제주 자연 속 걷기와 서핑 즐겨요.',
        profileImagePath: 'public/dori-4.png'
      },
      {
        residenceArea: '중문',
        nickname: '감귤달',
        residencePeriod: '6개월 미만',
        introduceSelf: '제주 감성 좋아해 잠시 살아봅니다!',
        profileImagePath: 'public/dori-1.png'
      },
      {
        residenceArea: '위미',
        nickname: '노을빈',
        residencePeriod: '6개월 이상 ~ 3년 미만',
        introduceSelf: '제주 적응 중! 공방 체험 좋아해요 🙂',
        profileImagePath: 'public/dori-3.png'
      },
      {
        residenceArea: '성산',
        nickname: '산들문',
        residencePeriod: '6개월 미만',
        introduceSelf: '안녕하세요, 저는 성산에 거주하는 산들문입니다.',
        profileImagePath: 'public/dori-2.png'
      }
    ];

    await userRepo.save(users);
  }
}
