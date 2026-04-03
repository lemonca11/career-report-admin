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
              <Descriptions.Item label="产品">{order.productName}</Descriptions.Item>
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
              <Descriptions.Item label="昵称">{user.nickname}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24}>
          <Card className="section-card" title="表单数据">
            <Descriptions column={2} bordered className="info-grid">
              <Descriptions.Item label="学生姓名">{order.formData.studentName}</Descriptions.Item>
              <Descriptions.Item label="性别">{order.formData.gender}</Descriptions.Item>
              <Descriptions.Item label="高考省份">{order.formData.gaokaoProvince}</Descriptions.Item>
              <Descriptions.Item label="户籍">{order.formData.householdRegistration}</Descriptions.Item>
              <Descriptions.Item label="本科院校">{order.formData.undergraduateSchool}</Descriptions.Item>
              <Descriptions.Item label="本科院系">{order.formData.undergraduateDepartment}</Descriptions.Item>
              <Descriptions.Item label="本科专业">{order.formData.undergraduateMajor}</Descriptions.Item>
              <Descriptions.Item label="入学年份">{order.formData.enrollmentYear}</Descriptions.Item>
              <Descriptions.Item label="政治身份">{order.formData.politicalStatus}</Descriptions.Item>
              <Descriptions.Item label="录取专业满意度">{order.formData.majorSatisfaction}</Descriptions.Item>
              <Descriptions.Item label="研究生升学意愿">{order.formData.postgraduateIntent}</Descriptions.Item>
              <Descriptions.Item label="研究生升学途径偏好">{order.formData.postgraduatePreference}</Descriptions.Item>
              <Descriptions.Item label="就业意愿">{order.formData.employmentPreference}</Descriptions.Item>
              <Descriptions.Item label="未来期望工作城市">
                <Space wrap>
                  {order.formData.expectedWorkCities.map((city) => (
                    <Tag key={city}>{city}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
