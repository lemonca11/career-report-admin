import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Empty, Row, Space, Statistic, Table } from 'antd';
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
    { title: '团队名称', dataIndex: 'name' },
    { title: '级别', dataIndex: 'level', render: (value) => <StatusTag value={value} /> },
    { title: '联系人', dataIndex: 'contact' },
    { title: '额度余额', dataIndex: 'quotaBalance' },
    { title: '订单数', dataIndex: 'totalOrders' },
  ];

  const quotaColumns: TableColumnsType<QuotaLog> = [
    { title: '时间', dataIndex: 'createdAt', width: 170 },
    { title: '类型', dataIndex: 'type', width: 90, render: (value) => <StatusTag value={value} /> },
    { title: '数量', dataIndex: 'amount', width: 100 },
    { title: '操作人', dataIndex: 'operator', width: 140 },
    { title: '备注', dataIndex: 'remark' },
    { title: '余额', dataIndex: 'balanceAfter', width: 100 },
  ];

  const orderColumns: TableColumnsType<Order> = [
    { title: '订单号', dataIndex: 'orderNo', width: 150 },
    { title: '用户', dataIndex: 'userName', width: 110 },
    { title: '产品', dataIndex: 'productName', width: 180 },
    { title: '金额', dataIndex: 'amount', width: 100, render: (value) => `¥${value}` },
    { title: '状态', dataIndex: 'status', width: 110, render: (value) => <StatusTag value={value} /> },
    { title: '下单时间', dataIndex: 'createdAt', width: 170 },
  ];

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
              <Descriptions.Item label="邮箱">{agent.email}</Descriptions.Item>
              <Descriptions.Item label="上级代理">{agent.parentName || '无'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <StatusTag value={agent.status} />
              </Descriptions.Item>
              <Descriptions.Item label="机构名称">{agent.company}</Descriptions.Item>
              <Descriptions.Item label="加入时间">{agent.joinedAt}</Descriptions.Item>
              <Descriptions.Item label="办公地址" span={2}>
                {agent.address}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card className="section-card">
                <Statistic title="团队规模" value={agent.teamSize} suffix="人" />
              </Card>
            </Col>
            <Col span={24}>
              <Card className="section-card">
                <Statistic title="当前额度余额" value={agent.quotaBalance} />
              </Card>
            </Col>
            <Col span={24}>
              <Card className="section-card">
                <Statistic title="累计订单数" value={agent.totalOrders} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24}>
          <Card className="section-card" title="下级团队">
            {subTeam.length ? (
              <Table rowKey="id" columns={teamColumns} dataSource={subTeam} pagination={false} scroll={{ x: 760 }} />
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
              scroll={{ x: 860 }}
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
              scroll={{ x: 860 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AgentDetailPage;
