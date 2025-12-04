import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { Meeting } from './entities/meeting.entity';
import { MeetingUser } from './entities/meeting-user.entity';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { MeetingCategory } from './entities/meeting-category.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(MeetingUser)
    private readonly meetingUserRepository: Repository<MeetingUser>,
    @InjectRepository(MeetingCategory)
    private readonly meetingCategoryRepository: Repository<MeetingCategory>
  ) {}

  // 모임 카테고리 목록 조회
  public async getMeetingCategoryList() {
    return await this.meetingCategoryRepository.find({
      select: {
        id: true,
        name: true
      }
    });
  }

  // 유저 맞춤 추천 생성
  private async createRecommendationForUser(user: User) {
    // 임시 로직
    const findMeetings = await this.meetingRepository.find({
      select: {
        id: true,
        name: true,
        area: true,
        isActive: true,
        createdAt: true,
        meetingUsers: {
          id: true,
          user: {
            id: true,
            nickname: true,
            profileImagePath: true
          }
        }
      },
      where: {
        isActive: 1,
        meetingUsers: { user: { id: Not(user.id) } }
      },
      relations: ['meetingUsers', 'meetingUsers.user'],
      take: 2
    });

    const meetings = findMeetings.map((meeting) => {
      const now = new Date();
      const createdAt = new Date(meeting.createdAt);
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let periodLabel = '';
      if (diffDays <= 30) {
        periodLabel = '신규';
      } else {
        const months = Math.floor(diffDays / 30);
        periodLabel = `${months}개월 이상`;
      }

      return {
        ...meeting,
        periodLabel
      };
    });

    return meetings;
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
    return await this.createRecommendationForUser(user);
  }

  // 내 참가 모임 목록 조회
  async getMyMeetings(user: User) {
    const userId = user.id;

    const meetings = await this.meetingRepository.find({
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
      where: {
        meetingUsers: { user: { id: userId } }
      },
      relations: ['meetingUsers', 'meetingUsers.user']
    });

    meetings.forEach((meeting) => {
      this.markMeetingUserAsMine(meeting, user);
    });

    return meetings;
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

    const findMeeting = await this.meetingRepository.findOne({
      where: {
        id,
        isActive: 1
      }
    });

    if (!findMeeting) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_DATA);
    }

    const createMeetingUser = this.meetingUserRepository.create({
      joinedAt: new Date(),
      meeting: { id },
      user: { id: userId }
    });

    await this.meetingUserRepository.save(createMeetingUser);

    return true;
  }

  // 모임 탈퇴
  async leaveMeeting(user: User, id: number) {
    const userId = user.id;

    await this.meetingUserRepository.softDelete({
      meeting: { id },
      user: { id: userId }
    });

    return true;
  }
}
