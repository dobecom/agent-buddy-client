import { MembersEntity } from "./EntityBase";

enum STATUS {
  DELETED = 'DELETED',
  SIGN_UP = 'SIGN_UP',
  VERIFIED = 'VERIFIED',
}

enum GRADE {
  NEW = 'NEW',
  BASIC = 'BASIC',
  VIP = 'VIP',
}

// 회원정보 DTO
export class Members extends MembersEntity {
  // Enum
  static readonly STATUS = STATUS;
  static readonly GRADE = GRADE;
  // Cache Key
  static readonly keyAt = 'members:at:';
  static readonly keyRt = 'members:rt:';
  static readonly keySess = 'members:session:';
  static readonly keyExpire = 'members:expire:';
  static readonly keyVerify = 'members:verify:';
  static readonly tokenSplit = '||';
  // Add Var
  verifyKey: string;
  verifyCode: string;
  static readonly limit = 10;
  page: number;
  passwordInit: boolean;
  constructor() {
    super();
  }
}
