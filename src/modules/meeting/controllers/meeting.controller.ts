import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { MeetingService } from '../meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Public()
  @Get('test')
  async test() {
    return 'Meeting Controller Test Success!!!';
  }
}
