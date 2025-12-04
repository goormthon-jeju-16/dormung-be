import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { ResidencePeriods } from 'src/modules/user/constants/residencePeriod';
import { User } from 'src/modules/user/entities/user.entity';

// 모임리스트 (위치, 유저들 관심사, )
@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private templatePrmpt = `
    당신은 제주 지역 커뮤니티 소모임을 자동 구성하는 매칭 엔진입니다.

    입력으로 다음 정보들이 주어집니다:
    - 대상 유저 (거주 기간, 관심 카테고리, 거주 지역)
    - 모임 리스트 (모임 대상위치, 모임원의 관심 카테고리, )
    
    소모임 생성 시 반드시 다음 조건을 만족해야 합니다:

    2) 각 소모임에는 최소 1명 이상 포함할 것.
    3) 각 소모임에는 신이주민(3개월~2년 미만) 또는 장기체류자(3개월 미만) 최소 1명 이상 포함할 것.
    4) 사용자들이 입력한 관심 카테고리(예: 친구/친교, 운동, 취향 공유 등)이 최대한 겹치도록 그룹 구성할 것.
    6) 거주 지역이 서로 너무 멀지 않도록, 가능한 한 근접 지역 사용자들을 우선적으로 묶어줄 것.
    7) 양쪽 집단(선이주민·도민&이주민·장기체류자)이 자연스럽게 교류할 수 있도록 문화적 다양성을 고려해 혼합 구성할 것.
    8) 소모임 이름은 해당 관심사 기반으로 매력적이고 제주스러운 톤으로 자동 생성할 것. (예: “애월 러닝크루”, “제주 바당 독서회”, “오름 탐방 팀”)
    9) 각 소모임에는 모임 설명, 타깃 관심사, 구성 인원 역할 요약(예: 도민 1명, 이주민 2명 등)을 출력할 것.
  `;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY')
    });
  }

  async createRecommendMeeting(userProfile: User, otherProfiles: User[]) {
    console.log('log', userProfile, otherProfiles.length);
    // console.log('log', this.templatePrmpt);
    // const response = await this.openai.chat.completions.create({
    //   model: 'gpt-4o-mini', // 모델 선택
    //   messages: [{ role: 'user', content: message }]
    // });

    // return response.choices[0].message.content;
  }
}
