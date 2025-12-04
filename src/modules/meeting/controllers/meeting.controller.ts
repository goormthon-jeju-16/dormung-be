import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { MeetingService } from '../meeting.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/modules/user/entities/user.entity';

@Controller('user/meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  // 추천 모임 목록 조회
  @Get('recommend/list')
  async getRecommendList(@AuthUser() user: User) {
    return await this.meetingService.getRecommendedMeetings(user);
  }

  // 모임 상세
  @Get(':id')
  async getMeetingDetail(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return await this.meetingService.getMeetingDetail(user, id);
  }

  // 모임 참가
  @Post('join/:id')
  async joinMeeting(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return await this.meetingService.joinMeeting(user, id);
  }

  // 모임 탈퇴
  @Post('leave/:id')
  async leaveMeeting(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return await this.meetingService.leaveMeeting(user, id);
  }
}
