export type OrderStatus = '待生成' | '生成中' | '已完成' | '生成失败' | '异常';
export type PaymentStatus = '已支付' | '待支付' | '已退款';

export interface OrderFormData {
  careerGoal: string;
  interests: string[];
  strengths: string[];
  concerns: string[];
  expectedIndustry: string;
  notes: string;
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
