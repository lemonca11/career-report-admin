import { create } from 'zustand';

import {
  agentApplications,
  agents,
  dashboardStats,
  orders,
  prompts,
  quotaLogs,
  rolePermissions,
  systemConfig,
  todoItems,
  trendData,
  users,
} from '@/data/mockData';
import type {
  Agent,
  AgentApplication,
  DashboardStats,
  Order,
  PromptItem,
  PromptVersion,
  QuotaLog,
  SystemConfig,
} from '@/types';

interface AdminState {
  applications: AgentApplication[];
  agents: Agent[];
  quotaLogs: QuotaLog[];
  orders: Order[];
  users: typeof users;
  prompts: PromptItem[];
  rolePermissions: typeof rolePermissions;
  systemConfig: SystemConfig;
  dashboardStats: DashboardStats;
  todoItems: typeof todoItems;
  trendData: typeof trendData;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
  toggleAgentStatus: (id: string) => void;
  grantQuota: (agentId: string, quantity: number, remark: string) => void;
  markOrderException: (id: string) => void;
  retryGenerate: (id: string) => void;
  updatePrompt: (id: string, content: string) => void;
  publishPrompt: (id: string) => void;
  rollbackPrompt: (id: string, versionId: string) => void;
  updateSystemConfig: (payload: Partial<SystemConfig>) => void;
}

const nowStamp = () => new Date().toLocaleString('zh-CN', { hour12: false });

const recalcStats = (state: Pick<AdminState, 'applications' | 'agents' | 'quotaLogs' | 'orders' | 'prompts'>): DashboardStats => ({
  totalAgents: state.agents.length,
  pendingApplications: state.applications.filter((item) => item.status === 'pending').length,
  totalQuotaGranted: state.quotaLogs.reduce((sum, item) => (item.quantity > 0 ? sum + item.quantity : sum), 0),
  quotaRemain: state.agents.reduce((sum, item) => sum + item.quotaRemain, 0),
  todayOrders: state.orders.filter((item) => item.createdAt.startsWith('2026-03-29')).length,
  promptPublishedCount: state.prompts.filter((item) => item.status === 'published').length,
});

export const useAdminStore = create<AdminState>((set) => ({
  applications: agentApplications,
  agents,
  quotaLogs,
  orders,
  users,
  prompts,
  rolePermissions,
  systemConfig,
  dashboardStats,
  todoItems,
  trendData,
  approveApplication: (id) =>
    set((state) => {
      const targetApplication = state.applications.find((item) => item.id === id);
      const applications: AgentApplication[] = state.applications.map((item) =>
        item.id === id ? { ...item, status: 'approved' as const, reviewedAt: nowStamp(), rejectReason: undefined } : item,
      );
      const hasAgent = targetApplication ? state.agents.some((item) => item.userId === targetApplication.userId) : true;
      const nextAgents: Agent[] =
        targetApplication && !hasAgent
          ? [
              {
                id: `agent-${Date.now()}`,
                userId: targetApplication.userId,
                userName: targetApplication.userName,
                mobile: targetApplication.mobile,
                realName: targetApplication.realName,
                companyName: targetApplication.companyName,
                regionText: targetApplication.regionText,
                agentLevel: targetApplication.applyLevel,
                quotaTotal: 0,
                quotaRemain: 0,
                soldCount: 0,
                distributedCount: 0,
                status: 'active',
                createdAt: nowStamp(),
              },
              ...state.agents,
            ]
          : state.agents;
      return {
        applications,
        agents: nextAgents,
        dashboardStats: recalcStats({ ...state, applications, agents: nextAgents }),
      };
    }),
  rejectApplication: (id, reason) =>
    set((state) => {
      const applications: AgentApplication[] = state.applications.map((item) =>
        item.id === id ? { ...item, status: 'rejected' as const, rejectReason: reason, reviewedAt: nowStamp() } : item,
      );
      return {
        applications,
        dashboardStats: recalcStats({ ...state, applications }),
      };
    }),
  toggleAgentStatus: (id) =>
    set((state) => {
      const nextAgents: Agent[] = state.agents.map((item) =>
        item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item,
      );
      return {
        agents: nextAgents,
        dashboardStats: recalcStats({ ...state, agents: nextAgents }),
      };
    }),
  grantQuota: (agentId, quantity, remark) =>
    set((state) => {
      const nextAgents: Agent[] = state.agents.map((item) =>
        item.id === agentId
          ? {
              ...item,
              quotaTotal: item.quotaTotal + quantity,
              quotaRemain: item.quotaRemain + quantity,
            }
          : item,
      );
      const target = nextAgents.find((item) => item.id === agentId);
      const nextLogs: QuotaLog[] = [
        {
          id: `quota-${Date.now()}`,
          toAgentId: agentId,
          toAgentName: target?.userName ?? '未知代理',
          changeType: 'platform_grant',
          quantity,
          remark,
          createdAt: nowStamp(),
        },
        ...state.quotaLogs,
      ];
      return {
        agents: nextAgents,
        quotaLogs: nextLogs,
        dashboardStats: recalcStats({ ...state, agents: nextAgents, quotaLogs: nextLogs }),
      };
    }),
  markOrderException: (id) =>
    set((state) => {
      const nextOrders: Order[] = state.orders.map((item) =>
        item.id === id
          ? {
              ...item,
              reportStatus: 'failed',
              errorLog: item.errorLog ?? '已由后台标记异常，等待人工排查。',
            }
          : item,
      );
      return { orders: nextOrders };
    }),
  retryGenerate: (id) =>
    set((state) => {
      const nextOrders: Order[] = state.orders.map((item) =>
        item.id === id
          ? {
              ...item,
              reportStatus: 'generating',
              generationRecords: [
                {
                  id: `gen-${Date.now()}`,
                  status: 'generating',
                  engine: 'gpt-report-v4',
                  durationSeconds: 0,
                  createdAt: nowStamp(),
                  summary: '后台触发重新生成。',
                },
                ...item.generationRecords,
              ],
            }
          : item,
      );
      return { orders: nextOrders };
    }),
  updatePrompt: (id, content) =>
    set((state) => {
      const nextPrompts: PromptItem[] = state.prompts.map((item) =>
        item.id === id ? { ...item, content, status: 'draft', updatedAt: nowStamp() } : item,
      );
      return { prompts: nextPrompts };
    }),
  publishPrompt: (id) =>
    set((state) => {
      const nextPrompts: PromptItem[] = state.prompts.map((item) => {
        if (item.id !== id) {
          return item;
        }
        const nextVersion: PromptVersion = {
          id: `pv-${item.id}-${item.versions.length + 1}`,
          version: item.versions.length + 1,
          content: item.content,
          note: '后台发布版本',
          createdBy: '系统管理员',
          createdAt: nowStamp(),
        };
        return {
          ...item,
          status: 'published',
          updatedAt: nowStamp(),
          versions: [nextVersion, ...item.versions],
        };
      });
      return {
        prompts: nextPrompts,
        dashboardStats: recalcStats({ ...state, prompts: nextPrompts }),
      };
    }),
  rollbackPrompt: (id, versionId) =>
    set((state) => {
      const nextPrompts: PromptItem[] = state.prompts.map((item) => {
        if (item.id !== id) {
          return item;
        }
        const targetVersion = item.versions.find((version) => version.id === versionId);
        if (!targetVersion) {
          return item;
        }
        return {
          ...item,
          content: targetVersion.content,
          status: 'draft',
          updatedAt: nowStamp(),
        };
      });
      return { prompts: nextPrompts };
    }),
  updateSystemConfig: (payload) =>
    set((state) => ({
      systemConfig: {
        ...state.systemConfig,
        ...payload,
      },
    })),
}));
