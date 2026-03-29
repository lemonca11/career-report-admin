import { ArrowLeftOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Empty, Row, Space, Tag, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useOrderStore, useUserStore } from '@/store';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);
  const users = useUserStore((state) => state.users);
  const retryGenerate = useOrderStore((state) => state.retryGenerate);
  const markAbnormal = useOrderStore((state) => state.markAbnormal);
  const order = orders.find((item) => item.id === id);
  const user = users.find((item) => item.id === order?.userId);

  if (!order || !user) {
    return (
      <div className="page-container">
        <Empty description="未找到对应订单" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageTitle
        title={`订单 ${order.orderNo}`}
        subtitle="查看订单基础信息、用户档案、问卷表单数据和运营处理动作。"
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders/list')}>
              返回列表
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                retryGenerate(order.id);
                message.success('已重新触发生成');
              }}
            >
              重试生成
            </Button>
            <Button
              icon={<ExclamationCircleOutlined />}
              onClick={() => {
                markAbnormal(order.id);
                message.success('订单已标记异常');
              }}
            >
              标记异常
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card className="section-card" title="订单信息">
            <Descriptions column={2} bordered className="info-grid">
              <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
              <Descriptions.Item label="报告编号">{order.reportId || '尚未生成'}</Descriptions.Item>
              <Descriptions.Item label="产品">{order.productName}</Descriptions.Item>
              <Descriptions.Item label="报告类型">{order.reportType}</Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <StatusTag value={order.status} />
              </Descriptions.Item>
              <Descriptions.Item label="支付状态">
                <StatusTag value={order.paymentStatus} />
              </Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{order.amount}</Descriptions.Item>
              <Descriptions.Item label="重试次数">{order.retryCount}</Descriptions.Item>
              <Descriptions.Item label="代理渠道">{order.agentName}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{order.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{order.updatedAt}</Descriptions.Item>
              <Descriptions.Item label="异常说明" span={2}>
                {order.exceptionNote || '无'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card className="section-card" title="用户信息">
            <Descriptions column={1} bordered className="info-grid">
              <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
              <Descriptions.Item label="昵称">{user.nickname}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="学校 / 专业">
                {user.university} / {user.major}
              </Descriptions.Item>
              <Descriptions.Item label="年级">{user.grade}</Descriptions.Item>
              <Descriptions.Item label="目标方向">{user.careerDirection}</Descriptions.Item>
              <Descriptions.Item label="用户状态">
                <StatusTag value={user.status} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24}>
          <Card className="section-card" title="表单数据">
            <Descriptions column={2} bordered className="info-grid">
              <Descriptions.Item label="目标岗位">{order.formData.careerGoal}</Descriptions.Item>
              <Descriptions.Item label="期望行业">{order.formData.expectedIndustry}</Descriptions.Item>
              <Descriptions.Item label="兴趣标签">
                <Space wrap>
                  {order.formData.interests.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="优势标签">
                <Space wrap>
                  {order.formData.strengths.map((item) => (
                    <Tag key={item} color="processing">
                      {item}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="当前顾虑">
                <Space wrap>
                  {order.formData.concerns.map((item) => (
                    <Tag key={item} color="warning">
                      {item}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="补充说明">{order.formData.notes}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
