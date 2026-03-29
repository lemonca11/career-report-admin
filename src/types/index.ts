export type AgentLevel = 'strategic' | 'city' | 'campus';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type AgentStatus = 'active' | 'inactive';
export type QuotaChangeType = 'platform_grant' | 'distribute' | 'sale_deduct';
export type OrderStatus = 'pending_payment' | 'paid' | 'completed' | 'payment_failed';
export type ReportStatus = 'generating' | 'success' | 'failed';
export type PromptStatus = 'draft' | 'published';
export type TodoType = 'application' | 'order' | 'prompt';
export type Priority = 'high' | 'medium' | 'low';

export interface DashboardStats {
  totalAgents: number;
  pendingApplications: number;
  totalQuotaGranted: number;
  quotaRemain: number;
  todayOrders: number;
  promptPublishedCount: number;
}

export interface TodoItem {
  id: string;
  type: TodoType;
  title: string;
  description: string;
  priority: Priority;
  createdAt: string;
}

export interface TrendPoint {
  label: string;
  orders: number;
  quotaIssued: number;
  reports: number;
}

export interface AgentApplication {
  id: string;
  userId: string;
  userName: string;
  mobile: string;
  realName: string;
  companyName: string;
  applyLevel: AgentLevel;
  regionText: string;
  sourceAgentName?: string;
  status: ApplicationStatus;
  rejectReason?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface Agent {
  id: string;
  userId: string;
  userName: string;
  mobile: string;
  realName: string;
  companyName: string;
  regionText: string;
  agentLevel: AgentLevel;
  parentAgentId?: string;
  parentAgentName?: string;
  quotaTotal: number;
  quotaRemain: number;
  soldCount: number;
  distributedCount: number;
  status: AgentStatus;
  createdAt: string;
}

export interface QuotaLog {
  id: string;
  fromAgentName?: string;
  toAgentId: string;
  toAgentName: string;
  changeType: QuotaChangeType;
  quantity: number;
  remark: string;
  createdAt: string;
}

export interface OrderFormSummary {
  undergraduateSchool: string;
  undergraduateMajor: string;
  targetTransferMajor?: string;
  expectedWorkCities: string[];
  postgraduateIntent: string;
}

export interface GenerationRecord {
  id: string;
  status: ReportStatus;
  engine: string;
  durationSeconds: number;
  createdAt: string;
  summary: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  mobile: string;
  targetName: string;
  amount: number;
  status: OrderStatus;
  reportStatus: ReportStatus;
  agentId?: string;
  agentName?: string;
  createdAt: string;
  paidAt?: string;
  errorLog?: string;
  formData: OrderFormSummary;
  generationRecords: GenerationRecord[];
}

export interface User {
  id: string;
  nickname: string;
  mobile: string;
  school: string;
  major: string;
  registerTime: string;
  lastActiveAt: string;
  orderCount: number;
  reportCount: number;
}

export interface PromptVersion {
  id: string;
  version: number;
  content: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface PromptItem {
  id: string;
  name: string;
  key: string;
  scene: string;
  content: string;
  status: PromptStatus;
  updatedAt: string;
  versions: PromptVersion[];
}

export interface RolePermission {
  id: string;
  roleName: string;
  description: string;
  scopes: string[];
}

export interface SystemConfig {
  inventoryWarningThreshold: number;
  defaultPromptPayload: string;
  defaultQuotaPack: number;
  abnormalOrderNotify: boolean;
}
