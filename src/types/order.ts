export type OrderStatus = '待生成' | '生成中' | '已完成' | '生成失败' | '异常';
export type PaymentStatus = '已支付' | '待支付' | '已退款';

export interface OrderFormData {
  studentName: string;
  gender: string;
  gaokaoProvince: string;
  householdRegistration: string;
  undergraduateSchool: string;
  undergraduateDepartment: string;
  undergraduateMajor: string;
  enrollmentYear: string;
  politicalStatus: string;
  majorSatisfaction: string;
  postgraduateIntent: string;
  postgraduatePreference: string;
  employmentPreference: string;
  expectedWorkCities: string[];
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  agentId: string;
  agentName: string;
  productName: string;
  reportType: string;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  reportId?: string;
  exceptionNote?: string;
  formData: OrderFormData;
}
