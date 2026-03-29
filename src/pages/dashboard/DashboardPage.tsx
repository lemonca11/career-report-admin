import {
  AlertOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { Link } from 'react-router-dom';

import MetricCard from '@/components/MetricCard';
import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useAgentStore, useOrderStore, useQuotaStore } from '@/store';
import type { Order } from '@/types/order';
import { formatNumber } from '@/utils/format';

const DashboardPage = () => {
  const applications = useAgentStore((state) => state.applications);
  const agents = useAgentStore((state) => state.agents);
  const quotaLogs = useQuotaStore((state) => state.logs);
  const orders = useOrderStore((state) => state.orders);

  const pendingApplications = applications.filter((item) => item.status === '待审核');
  const todayOrders = orders.filter((item) => item.createdAt.startsWith('2026-03-29'));
  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const pendingTasks = [
    ...pendingApplications.slice(0, 4).map((item) => ({
      id: item.id,
      title: `${item.applicantName} 的代理申请待审核`,
      description: `${item.region} / ${item.levelRequested} / 提交于 ${item.submittedAt}`,
      path: '/agents/applications',
      type: '代理审核',
    })),
    ...orders
      .filter((item) => item.status === '生成失败' || item.status === '异常')
      .slice(0, 4)
      .map((item) => ({
        id: item.id,
        title: `${item.orderNo} 需要人工处理`,
        description: `${item.userName} / ${item.status} / ${item.exceptionNote || '等待运营处理'}`,
        path: `/orders/${item.id}`,
        type: '订单处理',
      })),
  ].slice(0, 8);

  const columns: TableColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      width: 120,
    },
    {
      title: '代理',
      dataIndex: 'agentName',
      ellipsis: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
      render: (value) => `¥${value}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_, record) => <Link to={`/orders/${record.id}`}>详情</Link>,
    },
  ];

  return (
    <div className="page-container">
      <PageTitle
        title="控制台"
        subtitle="查看代理、订单与额度分发的核心运营指标。"
        extra={
          <Space>
            <Typography.Text type="secondary">最近同步：2026-03-29 14:10</Typography.Text>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="待审核代理数"
            value={pendingApplications.length}
            description="本周新增申请集中在华东与华南区域。"
            icon={<TeamOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="今日订单数"
            value={todayOrders.length}
            description="含待支付与已支付订单，支持明细追踪。"
            icon={<ClockCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="总代理数"
            value={agents.length}
            description="覆盖省级、城市代理与校园合伙人三级结构。"
            icon={<AlertOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="额度发放总数"
            value={formatNumber(quotaLogs.filter((item) => item.type === '发放').reduce((sum, item) => sum + item.amount, 0))}
            description="累计额度发放已覆盖重点区域代理扩张计划。"
            icon={<WalletOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} xl={9}>
          <Card className="section-card" title="待处理事项">
            <List
              dataSource={pendingTasks}
              locale={{ emptyText: '暂无待处理事项' }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="open" type="link">
                      <Link to={item.path}>前往处理</Link>
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Typography.Text>{item.title}</Typography.Text>
                        <StatusTag value={item.type === '代理审核' ? '待审核' : '异常'} />
                      </Space>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} xl={15}>
          <Card
            className="section-card"
            title="最近订单"
            extra={<Link to="/orders/list">查看全部</Link>}
          >
            <Table
              rowKey="id"
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              scroll={{ x: 760 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
