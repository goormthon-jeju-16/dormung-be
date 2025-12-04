import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MeetingCategory } from 'src/modules/meeting/entities/meeting-category.entity';
import { MeetingCategoryName } from 'src/modules/meeting/constants/meeting-category-name';

export class ProductMainSectionSeeder implements Seeder {
  static priority = 1;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const meetingCategoryRepo = dataSource.getRepository(MeetingCategory);

    const findMeetingCategory = await meetingCategoryRepo.find();
    if (findMeetingCategory.length) {
      return;
    }

    const meetingCategoryNamePromises = MeetingCategoryName.map(async (item, index) => {
      return meetingCategoryRepo.create({
        name: item
      });
    });

    const meetingCategories = (await Promise.all(meetingCategoryNamePromises)).filter(Boolean);

    if (meetingCategories.length > 0) {
      await meetingCategoryRepo.save(meetingCategories);
    }
  }
}
