export type UserStatus = '活跃' | '沉默';

export interface User {
  id: string;
  name: string;
  nickname: string;
  phone: string;
  university: string;
  major: string;
  grade: string;
  city: string;
  careerDirection: string;
  registerAt: string;
  lastActiveAt: string;
  totalOrders: number;
  reportCount: number;
  status: UserStatus;
}
