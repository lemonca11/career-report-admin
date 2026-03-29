import { BellOutlined, SaveOutlined, SafetyOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch, message } from 'antd';

import PageTitle from '@/components/PageTitle';

const SystemSettingsPage = () => {
  const [form] = Form.useForm();

  return (
    <div className="page-container">
      <PageTitle title="系统设置" subtitle="维护平台基础配置、通知策略与风险阈值。" />
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          siteName: '大学生职业规划报告系统管理后台',
          defaultQuota: 100,
          orderTimeout: 15,
          abnormalThreshold: 3,
          emailNotice: true,
          smsNotice: false,
          manualReview: true,
        }}
        onFinish={() => message.success('系统设置已保存')}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card className="section-card" title="平台参数">
              <Form.Item label="平台名称" name="siteName" rules={[{ required: true, message: '请输入平台名称' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="默认发放额度" name="defaultQuota">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="订单生成超时阈值（分钟）" name="orderTimeout">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card className="section-card" title="通知配置" extra={<BellOutlined />}>
              <Form.Item label="邮件通知" name="emailNotice" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="短信通知" name="smsNotice" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="异常订单强制人工复核" name="manualReview" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24}>
            <Card className="section-card" title="风险控制" extra={<SafetyOutlined />}>
              <Form.Item label="异常订单重试阈值" name="abnormalThreshold">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SystemSettingsPage;
