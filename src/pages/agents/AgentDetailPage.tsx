import { ArrowLeftOutlined, TeamOutlined, WalletOutlined, ShoppingCartOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Empty, Row, Space, Statistic, Table, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useAgentStore, useOrderStore, useQuotaStore } from '@/store';
import type { Agent, QuotaLog } from '@/types/agent';
import type { Order } from '@/types/order';

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const agents = useAgentStore((state) => state.agents);
  const quotaLogs = useQuotaStore((state) => state.logs);
  const orders = useOrderStore((state) => state.orders);
  const agent = agents.find((item) => item.id === id);

  if (!agent) {
    return (
      <div className="page-container">
        <Empty description="未找到对应代理信息" />
      </div>
    );
  }

  const subTeam = agents.filter((item) => item.parentId === agent.id);
  const quotaRecords = quotaLogs.filter((item) => item.agentId === agent.id);
  const orderRecords = orders.filter((item) => item.agentId === agent.id);

  const teamColumns: TableColumnsType<Agent> = [
    { title: '团队名称', dataIndex: 'name', ellipsis: true },
    { title: '级别', dataIndex: 'level', render: (value) => <StatusTag value={value} /> },
    {
      title: '联系人',
      dataIndex: 'contact',
      render: (text: string, record: Agent) => (
        <Button
          type="link"
          style={{ padding: 0, height: 'auto' }}
          onClick={() => navigate(`/agents/${record.id}`)}
        >
          {text}
        </Button>
      ),
    },
    { title: '额度余额', dataIndex: 'quotaBalance' },
    { title: '订单数', dataIndex: 'totalOrders' },
  ];

  const quotaColumns: TableColumnsType<QuotaLog> = [
    { title: '时间', dataIndex: 'createdAt' },
    { title: '类型', dataIndex: 'type', render: (value) => <StatusTag value={value} /> },
    { title: '数量', dataIndex: 'amount' },
    { title: '操作人', dataIndex: 'operator' },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
    { title: '余额', dataIndex: 'balanceAfter' },
  ];

  const orderColumns: TableColumnsType<Order> = [
    { title: '订单号', dataIndex: 'orderNo', ellipsis: true },
    { title: '用户', dataIndex: 'userName' },
    { title: '产品', dataIndex: 'productName', ellipsis: true },
    { title: '金额', dataIndex: 'amount', render: (value) => `¥${value}` },
    { title: '状态', dataIndex: 'status', render: (value) => <StatusTag value={value} /> },
    { title: '下单时间', dataIndex: 'createdAt' },
  ];

  // 统计卡片样式
  const statCardStyle = (color: string) => ({
    background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${color}20`,
  });

  const statIconStyle = (color: string) => ({
    fontSize: 24,
    color: color,
    background: `${color}15`,
    padding: 8,
    borderRadius: 12,
  });

  return (
    <div className="page-container">
      <PageTitle
        title={agent.name}
        subtitle="查看代理基本信息、下级团队、额度流水与关联订单。"
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/agents/list')}>
            返回代理列表
          </Button>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card className="section-card" title="基本信息">
            <Descriptions column={2} bordered className="info-grid">
              <Descriptions.Item label="代理编码">{agent.code}</Descriptions.Item>
              <Descriptions.Item label="代理级别">{agent.level}</Descriptions.Item>
              <Descriptions.Item label="所属区域">{agent.region}</Descriptions.Item>
              <Descriptions.Item label="联系人">{agent.contact}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{agent.phone}</Descriptions.Item>
              <Descriptions.Item label="上级代理">{agent.parentName || '无'}</Descriptions.Item>
              <Descriptions.Item label="机构名称">{agent.company}</Descriptions.Item>
              <Descriptions.Item label="加入时间">{agent.joinedAt}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card className="section-card" style={statCardStyle('#722ed1')} bodyStyle={{ padding: 16 }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <TeamOutlined style={statIconStyle('#722ed1')} />
                    <span style={{ color: token.colorTextSecondary, fontSize: 14 }}>团队规模</span>
                  </Space>
                  <Statistic value={agent.teamSize} suffix="人" valueStyle={{ fontSize: 28, fontWeight: 600, color: '#722ed1' }} />
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="section-card" style={statCardStyle('#1890ff')} bodyStyle={{ padding: 16 }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <WalletOutlined style={statIconStyle('#1890ff')} />
                    <span style={{ color: token.colorTextSecondary, fontSize: 14 }}>额度余额</span>
                  </Space>
                  <Statistic value={agent.quotaBalance} valueStyle={{ fontSize: 28, fontWeight: 600, color: '#1890ff' }} />
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="section-card" style={statCardStyle('#52c41a')} bodyStyle={{ padding: 16 }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <ShoppingCartOutlined style={statIconStyle('#52c41a')} />
                    <span style={{ color: token.colorTextSecondary, fontSize: 14 }}>累计订单</span>
                  </Space>
                  <Statistic value={agent.totalOrders} suffix="单" valueStyle={{ fontSize: 28, fontWeight: 600, color: '#52c41a' }} />
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="section-card" style={statCardStyle('#fa8c16')} bodyStyle={{ padding: 16 }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <DollarCircleOutlined style={statIconStyle('#fa8c16')} />
                    <span style={{ color: token.colorTextSecondary, fontSize: 14 }}>累计收益</span>
                  </Space>
                  <Statistic 
                    value={agent.totalIncome} 
                    prefix="¥" 
                    valueStyle={{ fontSize: 28, fontWeight: 600, color: '#fa8c16' }}
                    formatter={(value) => `${(Number(value) / 10000).toFixed(2)}万`}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24}>
          <Card className="section-card" title="下级团队">
            {subTeam.length ? (
              <Table rowKey="id" columns={teamColumns} dataSource={subTeam} pagination={false} />
            ) : (
              <Empty description="暂无下级团队" />
            )}
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="section-card" title="额度流水">
            <Table
              rowKey="id"
              columns={quotaColumns}
              dataSource={quotaRecords}
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="section-card" title="订单记录">
            <Table
              rowKey="id"
              columns={orderColumns}
              dataSource={orderRecords}
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AgentDetailPage;
