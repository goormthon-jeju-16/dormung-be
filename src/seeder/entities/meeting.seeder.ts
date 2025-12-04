import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MeetingCategory } from 'src/modules/meeting/entities/meeting-category.entity';
import { Meeting } from 'src/modules/meeting/entities/meeting.entity';
import { MeetingCategoryName } from 'src/modules/meeting/constants/meeting-category-name';
import { residenceAreas } from 'src/modules/user/constants/residenceArea';

export class MeetingSeeder implements Seeder {
  static priority = 2;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const MeetingRepo = dataSource.getRepository(Meeting);

    const findMeeting = await MeetingRepo.find();
    if (findMeeting.length) {
      return;
    }

    let meetings: Meeting[] = [];
    const meetingCategories = await dataSource.getRepository(MeetingCategory).find();

    meetingCategories.forEach(async (category, index) => {
      const area = residenceAreas[Math.floor(Math.random() * residenceAreas.length)];
      const meeting = MeetingRepo.create({
        categoryName: category.name,
        name: `${category.name} 모임`,
        area: area
      });
      meetings.push(meeting);
    });

    await MeetingRepo.save(meetings);
  }
}
