import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { Meeting } from 'src/modules/meeting/entities/meeting.entity';
import { ResidencePeriods } from 'src/modules/user/constants/residencePeriod';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY')
    });
  }

  async createRecommendMeeting(meetings: any[], userProfile: any) {
    let meetingRecommendCount = 0;
    if (meetings.length === 0) {
      return [];
    } else if (meetings.length > 2) {
      meetingRecommendCount = 2;
    } else if (meetings.length === 1) {
      meetingRecommendCount = 1;
    }

    const templatePrmpt = `
      당신은 제주 지역 커뮤니티 소모임을 자동 구성하는 매칭 엔진입니다.

      입력으로 다음 정보들이 주어집니다:
      - 대상 유저 (거주 기간, 관심 카테고리, 거주 지역)
      - 모임 리스트 (모임 위치, 모임 카테고리, 모임원들의 거주 기간)

      1순위. 유저의 거주기간과 모임 구성원들의 거주기간을 비교하여, 유사하지 않은 모임을 우선적으로 추천합니다.
      2순위. 유저의 관심 카테고리와 모임의 카테고리를 비교하여, 유사한 모임을 우선적으로 추천합니다.
      3순위. 유저의 거주 지역과 모임 위치를 비교하여, 가까운 모임을 우선적으로 추천합니다.

      응답은 모임의 ID만 배열로 나오면 되고 최대 ${meetingRecommendCount}개의 모임ID를 추천해줘야 합니다.
      [모임ID1, 모임ID2]

      유저 프로필: ${JSON.stringify(userProfile)}
      모임 리스트: ${JSON.stringify(meetings)}
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: templatePrmpt }]
    });

    return response.choices[0].message.content ? JSON.parse(response.choices[0].message.content) : [];
  }
}
