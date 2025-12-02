
// 회원
export class MembersEntity {
    // 고유키
    id: string;
    // 아이디
    identifier: string;
    // 비밀번호
    password: string;
    // 이름
    name: string | null;
    // 닉네임
    nickname: string | null;
    // 전화번호
    mobile: string | null;
    // 등급
    grade: string;
    // 인증실패횟수
    signFail: number;
    // 상태
    status: number;
    // 비밀번호만료일
    passwordExpiredAt: string | null;
    // 등록자
    createdBy: string;
    // 수정자
    updatedBy: string | null;
    // 생성일시
    createdAt: string;
    // 수정일시
    updatedAt: string | null;
  }
  