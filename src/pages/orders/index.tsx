import React from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Input,
  Select,
  Card,
} from 'antd';
import { EyeOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import { useOrderStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../types';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { orders, retryGenerate, markAbnormal } = useOrderStore();

  const getStatusTag = (status: Order['status']) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: '草稿' },
      generating: { color: 'processing', text: '生成中' },
      preview: { color: 'warning', text: '预览中' },
      unpaid: { color: 'warning', text: '待支付' },
      paid: { color: 'success', text: '已支付' },
      failed: { color: 'error', text: '失败' },
      refunded: { color: 'default', text: '已退款' },
    };
    const { color, text } = statusMap[status] || statusMap.draft;
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '被规划人',
      dataIndex: 'targetName',
      key: 'targetName',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => getStatusTag(status),
    },
    {
      title: '渠道',
      dataIndex: 'channelOwnerName',
      key: 'channelOwnerName',
      render: (name: string) => name || <Tag>平台直营</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Order) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            详情
          </Button>
          {record.status === 'failed' && (
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={() => retryGenerate(record.id)}
            >
              重试
            </Button>
          )}
          {record.status !== 'failed' && record.status !== 'refunded' && (
            <Button
              type="link"
              danger
              icon={<WarningOutlined />}
              onClick={() => markAbnormal(record.id)}
            >
              标记异常
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>订单中心</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Search placeholder="搜索订单号/用户" style={{ width: 300 }} />
          <Select placeholder="订单状态" style={{ width: 120 }} allowClear>
            <Option value="draft">草稿</Option>
            <Option value="generating">生成中</Option>
            <Option value="preview">预览中</Option>
            <Option value="unpaid">待支付</Option>
            <Option value="paid">已支付</Option>
            <Option value="failed">失败</Option>
            <Option value="refunded">已退款</Option>
          </Select>
          <Select placeholder="渠道来源" style={{ width: 120 }} allowClear>
            <Option value="platform">平台直营</Option>
            <Option value="agent">代理销售</Option>
          </Select>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Orders;
