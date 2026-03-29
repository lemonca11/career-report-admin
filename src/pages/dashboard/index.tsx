import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, List, Typography, Space } from 'antd';
import {
  TeamOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useDashboardStore } from '../../store';
import type { TodoItem, Order } from '../../types';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { stats, todos, recentOrders, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getPriorityColor = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '普通';
    }
  };

  const getTodoIcon = (type: TodoItem['type']) => {
    switch (type) {
      case 'application':
        return <TeamOutlined style={{ color: '#1677ff' }} />;
      case 'order':
        return <ShoppingCartOutlined style={{ color: '#52c41a' }} />;
      case 'withdraw':
        return <WalletOutlined style={{ color: '#faad14' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getStatusTag = (status: Order['status']) => {
    const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      draft: { color: 'default', text: '草稿', icon: <ClockCircleOutlined /> },
      generating: { color: 'processing', text: '生成中', icon: <ClockCircleOutlined /> },
      preview: { color: 'warning', text: '预览中', icon: <ExclamationCircleOutlined /> },
      unpaid: { color: 'warning', text: '待支付', icon: <ExclamationCircleOutlined /> },
      paid: { color: 'success', text: '已支付', icon: <CheckCircleOutlined /> },
      failed: { color: 'error', text: '失败', icon: <WarningOutlined /> },
      refunded: { color: 'default', text: '已退款', icon: <ClockCircleOutlined /> },
    };
    const { color, text, icon } = statusMap[status] || statusMap.draft;
    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
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
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <Title level={4}>控制台</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核代理"
              value={stats.pendingApplications}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={stats.todayOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总代理数"
              value={stats.totalAgents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="额度发放总数"
              value={stats.totalQuotaGranted}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 收入统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="今日收入"
              value={stats.todayIncome}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="累计收入"
              value={stats.totalIncome}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 待处理事项和最近订单 */}
      <Row gutter={16}>
        <Col xs={24} lg={12} style={{ marginBottom: 16 }}>
          <Card
            title="待处理事项"
            extra={<a href="#">查看全部</a>}
          >
            <List
              dataSource={todos}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getTodoIcon(item.type)}
                    title={
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag color={getPriorityColor(item.priority)}>
                          {getPriorityLabel(item.priority)}
                        </Tag>
                      </Space>
                    }
                    description={item.description}
                  />
                  <Text type="secondary">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="最近订单"
            extra={<a href="/orders">查看全部</a>}
          >
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
