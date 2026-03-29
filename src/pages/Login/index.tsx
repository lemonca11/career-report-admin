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
  SafetyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    
    // Mock login - in real app, this would call an API
    setTimeout(() => {
      setLoading(false);
      
      // Simple validation for demo
      if (values.username === 'admin' && values.password === 'admin123') {
        message.success('登录成功');
        
        // Store login state
        if (values.remember) {
          localStorage.setItem('admin_token', 'mock_token_' + Date.now());
          localStorage.setItem('admin_user', JSON.stringify({
            username: values.username,
            name: '运营管理员',
            role: 'admin',
          }));
        } else {
          sessionStorage.setItem('admin_token', 'mock_token_' + Date.now());
          sessionStorage.setItem('admin_user', JSON.stringify({
            username: values.username,
            name: '运营管理员',
            role: 'admin',
          }));
        }
        
        navigate('/dashboard');
      } else {
        message.error('用户名或密码错误');
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
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <SafetyOutlined style={{ fontSize: 32, color: '#fff' }} />
              </div>
              <Title level={3} style={{ marginBottom: 8 }}>
                信鸽系统
              </Title>
              <Text type="secondary">大学生职业规划报告管理后台</Text>
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
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <a href="#">忘记密码？</a>
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
                <Text type="secondary" style={{ fontSize: 12 }}>
                  演示账号：admin / admin123
                </Text>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
