import { create } from 'zustand';
import type {
  Agent,
  AgentApplication,
  QuotaLog,
} from '@/types/agent';
import type {
  Order,
} from '@/types/order';
import type {
  User,
} from '@/types/user';
import type {
  PromptItem,
} from '@/types/prompt';
import type {
  TodoItem,
  DashboardStats,
} from '@/types/index';

import {
  agentsMock,
  agentApplicationsMock,
  quotaLogsMock,
} from '@/mock/agents';
import {
  ordersMock,
} from '@/mock/orders';
import {
  usersMock,
} from '@/mock/users';
import {
  promptsMock,
} from '@/mock/prompts';
import {
  todosMock,
  dashboardStatsMock,
} from '@/mock/todos';

// Dashboard Store
interface DashboardStore {
  stats: DashboardStats;
  todos: TodoItem[];
  recentOrders: Order[];
  fetchDashboardData: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: dashboardStatsMock,
  todos: todosMock,
  recentOrders: ordersMock.slice(0, 5),
  fetchDashboardData: () => {
    set({
      stats: dashboardStatsMock,
      todos: todosMock,
      recentOrders: ordersMock.slice(0, 5),
    });
  },
}));

// Agent Store
interface AgentStore {
  agents: Agent[];
  applications: AgentApplication[];
  loading: boolean;
  fetchAgents: () => void;
  fetchApplications: () => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
  grantQuota: (agentId: string, quantity: number) => void;
  toggleAgentStatus: (agentId: string) => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: agentsMock,
  applications: agentApplicationsMock,
  loading: false,
  fetchAgents: () => set({ agents: agentsMock }),
  fetchApplications: () => set({ applications: agentApplicationsMock }),
  approveApplication: (id: string) => {
    const apps = get().applications.map((app) =>
      app.id === id
        ? { ...app, status: '已通过' as const, reviewedAt: new Date().toLocaleString('zh-CN') }
        : app
    );
    set({ applications: apps });
  },
  rejectApplication: (id: string, reason: string) => {
    const apps = get().applications.map((app) =>
      app.id === id
        ? { ...app, status: '已驳回' as const, note: reason, reviewedAt: new Date().toLocaleString('zh-CN') }
        : app
    );
    set({ applications: apps });
  },
  grantQuota: (agentId: string, quantity: number) => {
    const agents = get().agents.map((agent) =>
      agent.id === agentId
        ? { ...agent, quotaBalance: agent.quotaBalance + quantity, totalIssued: agent.totalIssued + quantity }
        : agent
    );
    set({ agents });
  },
  toggleAgentStatus: (agentId: string) => {
    const agents = get().agents.map((agent) =>
      agent.id === agentId
        ? { ...agent, status: agent.status === '启用' ? '停用' : '启用' }
        : agent
    );
    set({ agents });
  },
}));

// Quota Store
interface QuotaStore {
  logs: QuotaLog[];
  fetchLogs: () => void;
  addLog: (log: QuotaLog) => void;
  issueQuota: (agentId: string, amount: number, remark: string) => void;
}

export const useQuotaStore = create<QuotaStore>((set, get) => ({
  logs: quotaLogsMock,
  fetchLogs: () => set({ logs: quotaLogsMock }),
  addLog: (log: QuotaLog) => set({ logs: [log, ...get().logs] }),
  issueQuota: (agentId: string, amount: number, remark: string) => {
    const agent = get().logs.find((log) => log.agentId === agentId);
    const newLog: QuotaLog = {
      id: `log_${Date.now()}`,
      agentId,
      agentName: agent?.agentName || '未知代理',
      type: '发放',
      amount,
      remark,
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    set({ logs: [newLog, ...get().logs] });
  },
}));

// Order Store
interface OrderStore {
  orders: Order[];
  fetchOrders: () => void;
  retryGenerate: (orderId: string) => void;
  markAbnormal: (orderId: string) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: ordersMock,
  fetchOrders: () => set({ orders: ordersMock }),
  retryGenerate: (orderId: string) => {
    const orders = get().orders.map((order) =>
      order.id === orderId ? { ...order, status: '生成中' as const } : order
    );
    set({ orders });
    // Simulate success after 2 seconds
    setTimeout(() => {
      const updatedOrders = get().orders.map((order) =>
        order.id === orderId ? { ...order, status: '已完成' as const } : order
      );
      set({ orders: updatedOrders });
    }, 2000);
  },
  markAbnormal: (orderId: string) => {
    const orders = get().orders.map((order) =>
      order.id === orderId ? { ...order, status: '异常' as const } : order
    );
    set({ orders });
  },
}));

// User Store
interface UserStore {
  users: User[];
  fetchUsers: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: usersMock,
  fetchUsers: () => set({ users: usersMock }),
}));

// Prompt Store
interface PromptStore {
  prompts: PromptItem[];
  fetchPrompts: () => void;
  updatePrompt: (id: string, content: string) => void;
  publishPrompt: (id: string) => void;
  rollbackPrompt: (id: string, version: number) => void;
}

export const usePromptStore = create<PromptStore>((set, get) => ({
  prompts: promptsMock,
  fetchPrompts: () => set({ prompts: promptsMock }),
  updatePrompt: (id: string, content: string) => {
    const prompts = get().prompts.map((prompt) =>
      prompt.id === id
        ? { ...prompt, content, updatedAt: new Date().toLocaleString('zh-CN') }
        : prompt
    );
    set({ prompts });
  },
  publishPrompt: (id: string) => {
    const prompts = get().prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, status: '已发布' as const } : prompt
    );
    set({ prompts });
  },
  rollbackPrompt: (id: string, version: number) => {
    const prompt = get().prompts.find((p) => p.id === id);
    if (!prompt) return;
    
    const versionToRollback = prompt.versions.find((v) => v.version === version);
    if (!versionToRollback) return;
    
    const prompts = get().prompts.map((p) =>
      p.id === id
        ? {
            ...p,
            content: versionToRollback.content,
            updatedAt: new Date().toLocaleString('zh-CN'),
            versions: [
              ...p.versions,
              {
                ...versionToRollback,
                version: Math.max(...p.versions.map((v) => v.version)) + 1,
                createdAt: new Date().toLocaleString('zh-CN'),
              },
            ],
          }
        : p
    );
    set({ prompts });
  },
}));
