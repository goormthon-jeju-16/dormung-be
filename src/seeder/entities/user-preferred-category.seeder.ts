import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MeetingCategory } from 'src/modules/meeting/entities/meeting-category.entity';
import { MeetingCategoryName } from 'src/modules/meeting/constants/meeting-category-name.enum';
import { UserPreferredCategory } from 'src/modules/meeting/entities/user-preferred-category.entity';

export class UserPreferredCategorySeeder implements Seeder {
  static priority = 2;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userPreferredCategoryRepo = dataSource.getRepository(UserPreferredCategory);

    const findUserPreferredCategory = await userPreferredCategoryRepo.find();
    if (findUserPreferredCategory.length) {
      return;
    }

    const meetingCategoryRepo = dataSource.getRepository(MeetingCategory);
    const meetingCategories = await meetingCategoryRepo.find();
    const userRepo = dataSource.getRepository('User');
    const users = await userRepo.find();

    const userPreferredCategories: any = [];

    for (const user of users) {
      // 각 유저마다 2~4개의 선호 카테고리 랜덤 선택
      const shuffledCategories = meetingCategories.sort(() => 0.5 - Math.random());
      const selectedCategories = shuffledCategories.slice(0, Math.floor(Math.random() * 3) + 2);

      for (const category of selectedCategories) {
        const userPreferredCategory = userPreferredCategoryRepo.create({
          user,
          meetingCategory: category
        });
        userPreferredCategories.push(userPreferredCategory);
      }
    }

    if (userPreferredCategories.length > 0) {
      await userPreferredCategoryRepo.save(userPreferredCategories);
    }
  }
}
