import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { Meeting } from './entities/meeting.entity';
import { MeetingUser } from './entities/meeting-user.entity';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(MeetingUser)
    private readonly meetingUserRepository: Repository<MeetingUser>,
    private readonly transactionService: TransactionService
  ) {}

  // 유저 맞춤 추천 생성
  private async createRecommendationForUser(user: User) {
    // 임시 로직
    const meeting = await this.transactionService.runInTransaction(async (tr) => {
      const meetingRepo = tr.getRepository(Meeting);
      const meetingUserRepo = tr.getRepository(MeetingUser);

      const newMeeting = meetingRepo.create({
        categoryName: '테스트 카테고리',
        name: `테스트 모임`,
        area: '테스트 지역'
      });

      const savedMeeting = await meetingRepo.save(newMeeting);

      const meetingUsers: any = [];
      for (let i = 0; i < 2; i++) {
        const meetingUser = meetingUserRepo.create({
          user: { id: i === 0 ? i + 1 : user.id },
          meeting: savedMeeting
        });
        meetingUsers.push(meetingUser);
      }

      await meetingUserRepo.save(meetingUsers);
      return savedMeeting;
    });

    return meeting.id;
  }

  // 모임 유저 본인 표시
  private markMeetingUserAsMine(meeting: Meeting, user: User) {
    const findMyMeetingUserIndex = meeting.meetingUsers.findIndex((mu) => mu.user.id === user.id);
    if (findMyMeetingUserIndex >= 0) {
      (meeting.meetingUsers[findMyMeetingUserIndex].user as any).isMine = 1;
    }
  }

  // 추천 모임 목록 조회
  async getRecommendedMeetings(user: User) {
    const meetingId = await this.createRecommendationForUser(user);

    const meeting = await this.meetingRepository.findOne({
      select: {
        id: true,
        name: true,
        area: true,
        isActive: true,
        meetingUsers: {
          id: true,
          user: {
            id: true,
            nickname: true,
            profileImagePath: true
          }
        }
      },
      where: { id: meetingId, isActive: 1, meetingUsers: { user: { id: Not(user.id) } } },
      relations: ['meetingUsers', 'meetingUsers.user']
    });

    if (!meeting) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_DATA);
    }

    this.markMeetingUserAsMine(meeting, user);

    return meeting;
  }

  // 모임 상세
  async getMeetingDetail(user: User, id: number) {
    const meeting = await this.meetingRepository.findOne({
      select: {
        id: true,
        name: true,
        area: true,
        isActive: true,
        meetingUsers: {
          id: true,
          user: {
            id: true,
            nickname: true,
            profileImagePath: true
          }
        }
      },
      where: { id },
      relations: ['meetingUsers', 'meetingUsers.user']
    });

    if (!meeting) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_DATA);
    }

    this.markMeetingUserAsMine(meeting, user);

    return meeting;
  }

  // 모임 참가
  async joinMeeting(user: User, id: number) {
    const userId = user.id;

    const findMeetingUser = await this.meetingUserRepository.findOne({
      where: {
        meeting: { id },
        user: { id: userId }
      }
    });

    if (!findMeetingUser) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_DATA);
    }

    if (findMeetingUser && findMeetingUser.joinedAt) {
      throw new BadRequestException(ErrorMessages.ALREADY_JOINED_MEETING);
    }

    await this.transactionService.runInTransaction(async (tr) => {
      const meetingRepo = tr.getRepository(Meeting);
      const meetingUserRepo = tr.getRepository(MeetingUser);

      await meetingUserRepo.update({ id: findMeetingUser.id }, { joinedAt: new Date() });

      // 참가조건 확인 후 모임 활성화 재작업
      // const findAllMeetingUsers = await meetingUserRepo.find({
      //   where: { meeting: { id } }
      // });

      // if (findAllMeetingUsers.every((mu) => mu.joinedAt !== null)) {
      //   await meetingRepo.update({ id }, { isActive: 1 });
      // }
      await meetingRepo.update({ id }, { isActive: 1 });

      return true;
    });
  }
}
