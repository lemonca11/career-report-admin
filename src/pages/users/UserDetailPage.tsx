import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Empty, Row, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useOrderStore, useUserStore } from '@/store';
import type { Order } from '@/types/order';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const users = useUserStore((state) => state.users);
  const orders = useOrderStore((state) => state.orders);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="page-container">
        <Empty description="未找到对应用户" />
      </div>
    );
  }

  const userOrders = orders.filter((item) => item.userId === user.id);
  const reports = userOrders.map((item) => ({
    id: item.id,
    reportId: item.reportId || `${item.orderNo}-PENDING`,
    type: item.reportType,
    status: item.status,
    generatedAt: item.updatedAt,
  }));

  const orderColumns: TableColumnsType<Order> = [
    { title: '订单号', dataIndex: 'orderNo', width: 150 },
    { title: '产品', dataIndex: 'productName', width: 180 },
    { title: '金额', dataIndex: 'amount', width: 100, render: (value) => `¥${value}` },
    { title: '状态', dataIndex: 'status', width: 110, render: (value) => <StatusTag value={value} /> },
    { title: '下单时间', dataIndex: 'createdAt', width: 170 },
  ];

  const reportColumns: TableColumnsType<(typeof reports)[number]> = [
    { title: '报告编号', dataIndex: 'reportId', width: 150 },
    { title: '报告类型', dataIndex: 'type', width: 180 },
    { title: '状态', dataIndex: 'status', width: 110, render: (value) => <StatusTag value={value} /> },
    { title: '更新时间', dataIndex: 'generatedAt', width: 170 },
  ];

  return (
    <div className="page-container">
      <PageTitle
        title={user.name}
        subtitle="查看用户基础信息、订单历史和报告记录。"
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users/list')}>
            返回用户列表
          </Button>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="section-card" title="基本信息">
            <Descriptions column={3} bordered className="info-grid">
              <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
              <Descriptions.Item label="昵称">{user.nickname}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <StatusTag value={user.status} />
              </Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="学校">{user.university}</Descriptions.Item>
              <Descriptions.Item label="专业">{user.major}</Descriptions.Item>
              <Descriptions.Item label="年级">{user.grade}</Descriptions.Item>
              <Descriptions.Item label="城市">{user.city}</Descriptions.Item>
              <Descriptions.Item label="职业方向">{user.careerDirection}</Descriptions.Item>
              <Descriptions.Item label="注册时间">{user.registerAt}</Descriptions.Item>
              <Descriptions.Item label="最近活跃">{user.lastActiveAt}</Descriptions.Item>
              <Descriptions.Item label="累计订单 / 报告">
                {user.totalOrders} / {user.reportCount}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card className="section-card" title="订单记录">
            <Table
              rowKey="id"
              columns={orderColumns}
              dataSource={userOrders}
              pagination={{ pageSize: 5, showSizeChanger: false }}
              scroll={{ x: 760 }}
            />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card className="section-card" title="报告记录">
            <Table
              rowKey="id"
              columns={reportColumns}
              dataSource={reports}
              pagination={{ pageSize: 5, showSizeChanger: false }}
              scroll={{ x: 620 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetailPage;
