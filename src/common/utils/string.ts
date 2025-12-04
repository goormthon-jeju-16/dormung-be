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
