import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { Meeting } from './entities/meeting.entity';
import { MeetingUser } from './entities/meeting-user.entity';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { MeetingCategory } from './entities/meeting-category.entity';
import { OpenaiService } from 'src/services/openai/openai.service';

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
    private readonly meetingCategoryRepository: Repository<MeetingCategory>,
    private readonly openaiService: OpenaiService
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

  /**
   * 기획과 실제 내용이 다름 추후 수정 필요
   */
  private async createRecommendationForUser(user: User) {
    const findMeetings = await this.meetingRepository.find({
      select: {
        id: true,
        categoryName: true,
        name: true,
        area: true,
        meetingUsers: {
          id: true,
          user: {
            id: true,
            residencePeriod: true
          }
        }
      },
      relations: {
        meetingUsers: {
          user: true
        }
      },
      where: {
        isActive: 1
      }
    });

    const findUserProfile = await this.userRepository.findOne({
      select: {
        id: true,
        residencePeriod: true,
        residenceArea: true,
        userPreferredCategories: {
          id: true,
          meetingCategory: { name: true }
        }
      },
      where: { id: user.id },
      relations: {
        userPreferredCategories: {
          meetingCategory: true
        }
      }
    });

    if (!findUserProfile) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_DATA);
    }

    const userProfile = {
      id: findUserProfile.id,
      residencePeriod: findUserProfile.residencePeriod,
      residenceArea: findUserProfile.residenceArea,
      preferredCategories: findUserProfile.userPreferredCategories.filter((upc) => upc?.meetingCategory).map((upc) => upc.meetingCategory.name)
    };

    const meetingTargets = findMeetings
      .filter((item) => item.meetingUsers.every((mu) => mu.user.id !== user.id))
      .map((meeting) => {
        return {
          id: meeting.id,
          categoryName: meeting.categoryName,
          name: meeting.name,
          area: meeting.area,
          memberResidencePeriods: meeting.meetingUsers.map((mu) => mu.user.residencePeriod)
        };
      });

    const meetingIds = await this.openaiService.createRecommendMeeting(meetingTargets, userProfile);
    let meetings: Meeting[] = [];

    if (!meetingIds.length) {
      meetings = await this.meetingRepository.find({
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
              profileImagePath: true,
              residencePeriod: true,
              residenceArea: true,
              introduceSelf: true
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
    } else if (meetingIds.length === 1) {
      const firstMeeting = await this.meetingRepository.findOne({
        where: { id: meetingIds[0], isActive: 1 },
        relations: ['meetingUsers', 'meetingUsers.user'],
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
              profileImagePath: true,
              residencePeriod: true,
              residenceArea: true,
              introduceSelf: true
            }
          }
        }
      });

      const secondMeeting = await this.meetingRepository.findOne({
        where: {
          isActive: 1,
          id: Not(meetingIds[0]),
          meetingUsers: { user: { id: Not(user.id) } }
        },
        relations: ['meetingUsers', 'meetingUsers.user'],
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
              profileImagePath: true,
              residencePeriod: true,
              residenceArea: true,
              introduceSelf: true
            }
          }
        }
      });

      meetings = [firstMeeting, secondMeeting].filter(Boolean) as Meeting[];
    } else {
      meetings = await this.meetingRepository.find({
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
              profileImagePath: true,
              residencePeriod: true,
              residenceArea: true,
              introduceSelf: true
            }
          }
        },
        where: [
          { id: meetingIds[0], isActive: 1 },
          { id: meetingIds[1], isActive: 1 }
        ],
        relations: ['meetingUsers', 'meetingUsers.user']
      });
    }

    meetings = meetings.map((meeting) => {
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

    const meetingIdsResult = await this.meetingRepository.createQueryBuilder('m').leftJoin('meeting_users', 'mu', 'mu.meeting_id = m.id').where('mu.user_id = :userId', { userId }).select('m.id', 'id').getRawMany();

    const meetingIds = meetingIdsResult.map((row) => row.id); // 배열 형태로 변환

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
            profileImagePath: true,
            residencePeriod: true,
            residenceArea: true,
            introduceSelf: true
          }
        }
      },
      where: {
        id: In(meetingIds)
      },
      relations: {
        meetingUsers: {
          user: true
        }
      }
    });

    findMeetings.forEach((meeting) => {
      this.markMeetingUserAsMine(meeting, user);
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
