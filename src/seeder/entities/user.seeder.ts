import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MeetingCategory } from 'src/modules/meeting/entities/meeting-category.entity';
import { MeetingCategoryName } from 'src/modules/meeting/constants/meeting-category-name.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { ResidencePeriod } from 'src/modules/user/constants/residencePeriod.enum';

export class UserSeeder implements Seeder {
  static priority = 2;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepo = dataSource.getRepository(User);

    const findUser = await userRepo.find();
    if (findUser.length) {
      return;
    }

    const users = [
      { residenceArea: '연동', nickname: '유저1', residencePeriod: ResidencePeriod.PLANNED_MOVE, introduceSelf: '안녕하세요 유저1입니다.', profileImagePath: '/path' },
      { residenceArea: '아라동', nickname: '유저2', residencePeriod: ResidencePeriod.PLANNED_MOVE, introduceSelf: '안녕하세요 유저2입니다.', profileImagePath: '/path' },
      { residenceArea: '이도', nickname: '유저3', residencePeriod: ResidencePeriod.SHORT_TERM_STAY, introduceSelf: '안녕하세요 유저3입니다.', profileImagePath: '/path' },
      { residenceArea: '애월', nickname: '유저4', residencePeriod: ResidencePeriod.PLANNED_MOVE, introduceSelf: '안녕하세요 유저4입니다.', profileImagePath: '/path' },
      { residenceArea: '한림', nickname: '유저5', residencePeriod: ResidencePeriod.SHORT_TERM_STAY, introduceSelf: '안녕하세요 유저5입니다.', profileImagePath: '/path' },
      { residenceArea: '함덕', nickname: '유저6', residencePeriod: ResidencePeriod.THREE_YEARS_OVER, introduceSelf: '안녕하세요 유저6입니다.', profileImagePath: '/path' },
      { residenceArea: '중문', nickname: '유저7', residencePeriod: ResidencePeriod.PLANNED_MOVE, introduceSelf: '안녕하세요 유저7입니다.', profileImagePath: '/path' },
      { residenceArea: '서귀동', nickname: '유저8', residencePeriod: ResidencePeriod.SIX_MONTHS_UNDER, introduceSelf: '안녕하세요 유저8입니다.', profileImagePath: '/path' },
      { residenceArea: '위미', nickname: '유저9', residencePeriod: ResidencePeriod.SIX_MONTHS_TO_3_YEARS, introduceSelf: '안녕하세요 유저9입니다.', profileImagePath: '/path' },
      { residenceArea: '성산', nickname: '유저10', residencePeriod: ResidencePeriod.SIX_MONTHS_TO_3_YEARS, introduceSelf: '안녕하세요 유저10입니다.', profileImagePath: '/path' },
      { residenceArea: '연동', nickname: '유저11', residencePeriod: ResidencePeriod.SHORT_TERM_STAY, introduceSelf: '안녕하세요 유저11입니다.', profileImagePath: '/path' },
      { residenceArea: '아라동', nickname: '유저12', residencePeriod: ResidencePeriod.THREE_YEARS_OVER, introduceSelf: '안녕하세요 유저12입니다.', profileImagePath: '/path' },
      { residenceArea: '이도', nickname: '유저13', residencePeriod: ResidencePeriod.PLANNED_MOVE, introduceSelf: '안녕하세요 유저13입니다.', profileImagePath: '/path' },
      { residenceArea: '애월', nickname: '유저14', residencePeriod: ResidencePeriod.SIX_MONTHS_UNDER, introduceSelf: '안녕하세요 유저14입니다.', profileImagePath: '/path' },
      { residenceArea: '한림', nickname: '유저15', residencePeriod: ResidencePeriod.SIX_MONTHS_TO_3_YEARS, introduceSelf: '안녕하세요 유저15입니다.', profileImagePath: '/path' },
      { residenceArea: '함덕', nickname: '유저16', residencePeriod: ResidencePeriod.THREE_YEARS_OVER, introduceSelf: '안녕하세요 유저16입니다.', profileImagePath: '/path' },
      { residenceArea: '중문', nickname: '유저17', residencePeriod: ResidencePeriod.PLANNED_MOVE, introduceSelf: '안녕하세요 유저17입니다.', profileImagePath: '/path' },
      { residenceArea: '서귀동', nickname: '유저18', residencePeriod: ResidencePeriod.SIX_MONTHS_UNDER, introduceSelf: '안녕하세요 유저18입니다.', profileImagePath: '/path' },
      { residenceArea: '위미', nickname: '유저19', residencePeriod: ResidencePeriod.SIX_MONTHS_TO_3_YEARS, introduceSelf: '안녕하세요 유저19입니다.', profileImagePath: '/path' },
      { residenceArea: '성산', nickname: '유저20', residencePeriod: ResidencePeriod.SIX_MONTHS_TO_3_YEARS, introduceSelf: '안녕하세요 유저20입니다.', profileImagePath: '/path' }
    ];

    await userRepo.save(users);
  }
}
