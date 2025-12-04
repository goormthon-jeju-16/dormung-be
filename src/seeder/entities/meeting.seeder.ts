import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MeetingCategory } from 'src/modules/meeting/entities/meeting-category.entity';
import { MeetingCategoryName } from 'src/modules/meeting/constants/meeting-category-name.enum';
import { UserPreferredCategory } from 'src/modules/meeting/entities/user-preferred-category.entity';
import { Meeting } from 'src/modules/meeting/entities/meeting.entity';
import { convertMeetingCategoryNameToKorean } from 'src/common/utils/string';

export class MeetingSeeder implements Seeder {
  static priority = 2;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const MeetingRepo = dataSource.getRepository(Meeting);

    const findMeeting = await MeetingRepo.find();
    if (findMeeting.length) {
      return;
    }

    const meetingCategoryRepo = dataSource.getRepository(MeetingCategory);
    const meetingCategories = await meetingCategoryRepo.find();

    // 카테고리별로 미팅 하나씩 생성
    const meetings: any = [];
    const areas = ['연동', '아라동', '이도', '애월', '한림', '함덕', '중문', '서귀동', '위미', '성산'];
    for (const category of meetingCategories) {
      for (const area of areas) {
        const koreanCategoryName = convertMeetingCategoryNameToKorean(category.name);
        const meeting = MeetingRepo.create({
          categoryName: category.name,
          name: `${area} ${koreanCategoryName} 모임`,
          area: area
        });
        meetings.push(meeting);
      }
    }

    await MeetingRepo.save(meetings);
  }
}
