export function convertMeetingCategoryNameToKorean(categoryName: string) {
  switch (categoryName) {
    case 'LIVING_INFO':
      return '생활 정보 필요';
    case 'HOBBY_LEISURE':
      return '취미/여가 활동';
    case 'CHILDCARE':
      return '육아 정보';
    case 'FRIEND_MEETING':
      return '친구/모임 만들기';
    case 'JOB_NETWORKING':
      return '직업 네트워킹';
    default:
      return '-';
  }
}

export function convertResidencePeriodToKorean(residencePeriod: string) {
  switch (residencePeriod) {
    case 'SIX_MONTHS_UNDER':
      return '6개월 미만';
    case 'SIX_MONTHS_TO_3_YEARS':
      return '6개월 이상 ~ 3년 미만';
    case 'THREE_YEARS_OVER':
      return '3년 이상~';
    case 'PLANNED_MOVE':
      return '이주 예정';
    case 'SHORT_TERM_STAY':
      return '단기 체류 중';
    default:
      return '-';
  }
}
