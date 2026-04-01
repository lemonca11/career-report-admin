import { Tag } from 'antd';
import type { AgentLevel, ApplicationStatus, OrderStatus, AgentStatus } from '../types';

export const LevelTag = ({ level }: { level: AgentLevel }) => {
  const colors: Record<AgentLevel, string> = {
    '战略代理': 'purple',
    '城市代理': 'blue',
    '校园代理': 'green',
  };
  return <Tag color={colors[level]}>{level}</Tag>;
};

export const ApplicationStatusTag = ({ status }: { status: ApplicationStatus }) => {
  const colors: Record<ApplicationStatus, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  };
  const labels: Record<ApplicationStatus, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回',
  };
  return <Tag color={colors[status]}>{labels[status]}</Tag>;
};

export const OrderStatusTag = ({ status, value }: { status?: OrderStatus; value?: string }) => {
  const statusValue = status || value || '';
  const colors: Record<string, string> = {
    draft: 'default',
    generating: 'processing',
    preview: 'warning',
    unpaid: 'warning',
    paid: 'success',
    failed: 'error',
    refunded: 'default',
    待审核: 'warning',
    已通过: 'success',
    已驳回: 'error',
    草稿: 'default',
    生成中: 'processing',
    预览中: 'warning',
    待支付: 'warning',
    已支付: 'success',
    已退款: 'default',
  };
  const labels: Record<string, string> = {
    draft: '草稿',
    generating: '生成中',
    preview: '预览中',
    unpaid: '待支付',
    paid: '已支付',
    failed: '失败',
    refunded: '已退款',
  };
  return <Tag color={colors[statusValue] || 'default'}>{labels[statusValue] || statusValue}</Tag>;
};

export const AgentStatusTag = ({ status, value }: { status?: AgentStatus; value?: string }) => {
  const statusValue = status || value || '';
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    正常: 'success',
    停用: 'default',
  };
  const labels: Record<string, string> = {
    active: '正常',
    inactive: '停用',
  };
  return <Tag color={colors[statusValue] || 'default'}>{labels[statusValue] || statusValue}</Tag>;
};

// Default export - flexible StatusTag that accepts both status and value props
const StatusTag = ({ status, value }: { status?: string; value?: string }) => {
  const statusValue = status || value || '';
  const colors: Record<string, string> = {
    // Order statuses
    draft: 'default',
    generating: 'processing',
    preview: 'warning',
    unpaid: 'warning',
    paid: 'success',
    failed: 'error',
    refunded: 'default',
    // Application statuses
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    // Agent statuses
    active: 'success',
    inactive: 'default',
    // Chinese labels
    待审核: 'warning',
    已通过: 'success',
    已驳回: 'error',
    草稿: 'default',
    生成中: 'processing',
    预览中: 'warning',
    待支付: 'warning',
    已支付: 'success',
    已退款: 'default',
    正常: 'success',
    停用: 'default',
  };
  const labels: Record<string, string> = {
    draft: '草稿',
    generating: '生成中',
    preview: '预览中',
    unpaid: '待支付',
    paid: '已支付',
    failed: '失败',
    refunded: '已退款',
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回',
    active: '正常',
    inactive: '停用',
  };
  return <Tag color={colors[statusValue] || 'default'}>{labels[statusValue] || statusValue}</Tag>;
};

export default StatusTag;
