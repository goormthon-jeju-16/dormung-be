import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { ResidencePeriods } from 'src/modules/user/constants/residencePeriod';
import { residenceAreas } from 'src/modules/user/constants/residenceArea';

export class UserSeeder implements Seeder {
  static priority = 2;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepo = dataSource.getRepository(User);

    const findUser = await userRepo.find();
    if (findUser.length) {
      return;
    }

    const dummyNicknames = ['한라바람', '오름길', '우도새빛', '섬바당', '돌하르', '귤향비', '감귤달', '바다초이', '노을빈', '산들문'];

    let users: User[] = [];
    for (let i = 0; i < residenceAreas.length; i++) {
      const user = new User();
      user.residenceArea = residenceAreas[i];
      user.nickname = dummyNicknames[i];
      user.residencePeriod = ResidencePeriods[Math.floor(Math.random() * ResidencePeriods.length)];
      user.introduceSelf = `안녕하세요, 저는 ${residenceAreas[i]}에 거주하는 ${dummyNicknames[i]}입니다.`;
      user.profileImagePath = `/images/profiles/test.jpg`;
      users.push(user);
    }

    await userRepo.save(users);
  }
}
