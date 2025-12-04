import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MeetingUser } from 'src/modules/meeting/entities/meeting-user.entity';

export class MeetingUserSeeder implements Seeder {
  static priority = 3;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const meetingUserRepo = dataSource.getRepository(MeetingUser);

    const findMeetingUsers = await meetingUserRepo.find();
    if (findMeetingUsers.length) {
      return;
    }

    // 유저 목록 조회, 미팅 목록 조회 후 랜덤으로 매칭 로직 작성 필요
    // 예시로 모든 유저를 모든 미팅에 매칭하는 로직 작성
    const userRepo = dataSource.getRepository('User');
    const meetingRepo = dataSource.getRepository('Meeting');

    const users = await userRepo.find();
    const meetings = await meetingRepo.find();

    const meetingUsers: MeetingUser[] = [];

    users.forEach((user) => {
      meetings.forEach((meeting) => {
        const meetingUser = meetingUserRepo.create({
          joinedAt: new Date(),
          user: { id: user.id },
          meeting: { id: meeting.id }
        });
        meetingUsers.push(meetingUser);
      });
    });

    await meetingUserRepo.save(meetingUsers);
  }
}
