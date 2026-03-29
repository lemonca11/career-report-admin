import type { TodoItem, DashboardStats } from '@/types/index';

export const todosMock: TodoItem[] = [
  {
    id: 'todo-1',
    type: 'application',
    title: '待审核代理申请',
    description: '西南区域校园代理申请已等待 6 小时，请优先处理。',
    priority: 'high',
    createdAt: '2026-03-29 09:30',
  },
  {
    id: 'todo-2',
    type: 'order',
    title: '报告生成失败',
    description: '订单 O-240329-103 因输出超时失败，需要重试。',
    priority: 'high',
    createdAt: '2026-03-29 10:12',
  },
  {
    id: 'todo-3',
    type: 'prompt',
    title: 'Prompt 版本待发布',
    description: '院校推荐总结 Prompt 已完成测试，但尚未正式发布。',
    priority: 'medium',
    createdAt: '2026-03-29 11:05',
  },
];

export const dashboardStatsMock: DashboardStats = {
  totalAgents: 36,
  pendingApplications: 5,
  totalQuotaGranted: 2480,
  quotaRemain: 632,
  todayOrders: 27,
  promptPublishedCount: 3,
};
