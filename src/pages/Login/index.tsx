import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  message,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAdminAccountStore } from '@/store';
import loginLogo from '../../../logo.png';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const markLastLogin = useAdminAccountStore((state) => state.markLastLogin);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    
    // Mock login - in real app, this would call an API
    setTimeout(() => {
      setLoading(false);
      
      const adminUser = useAdminAccountStore
        .getState()
        .adminUsers.find((item) => item.username === values.username);

      if (!adminUser || adminUser.passwordHash !== values.password) {
        message.error('账号或密码错误');
        return;
      }

      if (adminUser.status === 'disabled') {
        message.error('账号已停用，请联系超级管理员');
        return;
      }

      if (adminUser) {
        message.success('登录成功');
        markLastLogin(adminUser.username);
        
        // Store login state
        if (values.remember) {
          localStorage.setItem('admin_token', 'mock_token_' + Date.now());
          localStorage.setItem('admin_user', JSON.stringify({
            id: adminUser.id,
            username: adminUser.username,
            name: adminUser.name,
            roleCode: adminUser.roleCode,
          }));
        } else {
          sessionStorage.setItem('admin_token', 'mock_token_' + Date.now());
          sessionStorage.setItem('admin_user', JSON.stringify({
            id: adminUser.id,
            username: adminUser.username,
            name: adminUser.name,
            roleCode: adminUser.roleCode,
          }));
        }
        
        navigate('/dashboard');
      }
    }, 1000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              borderRadius: 16,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  borderRadius: 20,
                  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
                }}
              >
                <img
                  src={loginLogo}
                  alt="信鸽系统 Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 20,
                    display: 'block',
                  }}
                />
              </div>
              <Title level={3} style={{ marginBottom: 8 }}>
                信鸽系统
              </Title>
              <Text type="secondary">大学AI规划报告管理后台</Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入账号"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    密码重置请联系超级管理员
                  </Text>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  登录
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Space direction="vertical" size={2}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    超级管理员：admin / admin123
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    非超级管理员：operator / operator123
                  </Text>
                </Space>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
