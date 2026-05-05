import {
  AlertOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  FundOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import MetricCard from '@/components/MetricCard';
import { ordersMock } from '@/mock/orders';
import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useAgentStore, useOrderStore, useQuotaStore } from '@/store';
import type { Order } from '@/types/order';
import { formatNumber } from '@/utils/format';

const DashboardPage = () => {
  const navigate = useNavigate();
  const applications = useAgentStore((state) => state.applications);
  const agents = useAgentStore((state) => state.agents);
  const quotaLogs = useQuotaStore((state) => state.logs);
  const orders = useOrderStore((state) => state.orders);
  const pendingApplicationsPath = '/agents/applications?status=待审核';
  const maxPendingTasks = 8;
  const maxRecentOrders = 12;

  const pendingApplications = applications.filter((item) => item.status === '待审核');
  const todayOrders = orders.filter((item) => item.createdAt.startsWith('2026-03-29'));
  const totalIncome = agents.reduce((sum, item) => sum + item.totalIncome, 0);
  const totalOrderFlow = orders
    .filter((item) => item.paymentStatus === '已支付')
    .reduce((sum, item) => sum + item.amount, 0);
  const sortedOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const mockOrderFallbacks = [...ordersMock]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((item) => !sortedOrders.some((order) => order.id === item.id));
  const recentOrders = [...sortedOrders, ...mockOrderFallbacks].slice(0, maxRecentOrders);
  const pendingTasks = [
    ...pendingApplications.slice(0, 4).map((item) => ({
      id: item.id,
      title: `${item.applicantName} 的代理申请待审核`,
      description: `${item.region} / ${item.levelRequested} / 提交于 ${item.submittedAt}`,
      path: pendingApplicationsPath,
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
  ].slice(0, maxPendingTasks);

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
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
      render: (value) => `¥${value}`,
    },
    {
      title: '订单状态',
      dataIndex: 'paymentStatus',
      width: 120,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '报告状态',
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
    <div className="page-container dashboard-page">
      <PageTitle
        title="驾驶舱"
        subtitle="查看代理、订单与额度分发的核心运营指标。"
        extra={
          <Space>
            <Typography.Text className="dashboard-page__sync">最近同步：2026-03-29 14:10</Typography.Text>
          </Space>
        }
      />

      <div className="dashboard-page__metrics-grid">
        <div>
          <MetricCard
            title="待审核代理数"
            value={pendingApplications.length}
            description="请及时处理待审核订单"
            icon={<TeamOutlined />}
            to="/agents/applications?status=待审核"
          />
        </div>
        <div>
          <MetricCard
            title="今日订单数"
            value={todayOrders.length}
            description="含待支付及已支付订单"
            icon={<ClockCircleOutlined />}
            to="/orders/list"
          />
        </div>
        <div>
          <MetricCard
            title="总代理数"
            value={agents.length}
            description="覆盖战略、城市、校园代理"
            icon={<AlertOutlined />}
            to="/agents/list"
          />
        </div>
        <div>
          <MetricCard
            title="额度发放总数"
            value={formatNumber(quotaLogs.filter((item) => item.type === '发放').reduce((sum, item) => sum + item.amount, 0))}
            description="累计发给代理商报告数量"
            icon={<WalletOutlined />}
            to="/quota"
          />
        </div>
        <div>
          <MetricCard
            title="累计收益"
            value={`¥${formatNumber(totalIncome)}`}
            description="平台产生的归属平台收益"
            icon={<DollarCircleOutlined />}
            to="/quota"
          />
        </div>
        <div>
          <MetricCard
            title="订单流水"
            value={`¥${formatNumber(totalOrderFlow)}`}
            description="平台产生的实际流水"
            icon={<FundOutlined />}
            to="/orders/list"
          />
        </div>
      </div>

      <Row gutter={[16, 16]} className="dashboard-page__content">
        <Col xs={24} xl={9}>
          <Card
            className="section-card dashboard-page__section-card"
            title={<span className="dashboard-page__section-title">待处理事项</span>}
            extra={
              <Link className="dashboard-page__table-link" to={pendingApplicationsPath}>
                查看全部
              </Link>
            }
          >
            <List
              className="dashboard-page__task-list"
              dataSource={pendingTasks}
              locale={{ emptyText: '暂无待处理事项' }}
              renderItem={(item) => (
                <List.Item
                  className="dashboard-page__task-item"
                  onClick={() => navigate(item.path)}
                  actions={[
                    <Button
                      key="open"
                      className="dashboard-page__task-action"
                      type="link"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
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
            className="section-card dashboard-page__section-card"
            title={<span className="dashboard-page__section-title">最近订单</span>}
            extra={
              <Link className="dashboard-page__table-link" to="/orders/list">
                查看全部
              </Link>
            }
          >
            <Table
              className="dashboard-page__table"
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
