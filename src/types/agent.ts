export type AgentLevel = '省级代理' | '城市代理' | '校园合伙人';
export type AgentStatus = '启用' | '停用';
export type AgentApplicationStatus = '待审核' | '已通过' | '已驳回';
export type QuotaLogType = '发放' | '扣减';

export interface AgentApplication {
  id: string;
  applicantName: string;
  company: string;
  phone: string;
  email: string;
  region: string;
  levelRequested: AgentLevel;
  experienceYears: number;
  submittedAt: string;
  status: AgentApplicationStatus;
  reviewer?: string;
  reviewedAt?: string;
  note?: string;
}

export interface Agent {
  id: string;
  code: string;
  name: string;
  level: AgentLevel;
  parentId?: string;
  parentName?: string;
  region: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  teamSize: number;
  quotaBalance: number;
  totalIssued: number;
  totalOrders: number;
  status: AgentStatus;
  joinedAt: string;
  lastOrderAt: string;
}

export interface QuotaLog {
  id: string;
  agentId: string;
  agentName: string;
  type: QuotaLogType;
  amount: number;
  operator: string;
  remark: string;
  createdAt: string;
  balanceAfter: number;
}
