import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  Badge,
  Space,
  Typography,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '控制台',
    },
    {
      key: '/agents',
      icon: <TeamOutlined />,
      label: '代理管理',
      children: [
        { key: '/agents', label: '代理列表' },
        { key: '/agents/applications', label: '申请审核' },
      ],
    },
    {
      key: '/quota',
      icon: <WalletOutlined />,
      label: '额度管理',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单中心',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户中心',
    },
    {
      key: '/prompts',
      icon: <FileTextOutlined />,
      label: 'Prompt管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  const userMenuItems = [
    { key: 'profile', label: '个人资料' },
    { key: 'settings', label: '账号设置' },
    { type: 'divider' },
    { key: 'logout', label: '退出登录' },
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/agents/')) return [path];
    if (path.startsWith('/orders/')) return ['/orders'];
    if (path.startsWith('/users/')) return ['/users'];
    if (path.startsWith('/prompts/')) return ['/prompts'];
    return [path];
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space>
            <div
              style={{
                width: 32,
                height: 32,
                background: '#1677ff',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              信
            </div>
            {!collapsed && (
              <Text strong style={{ fontSize: 16 }}>
                信鸽系统
              </Text>
            )}
          </Space>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <Space>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                style: { fontSize: 18, cursor: 'pointer' },
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Space>
          <Space size={24}>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <Text>管理员</Text>
                <DownOutlined style={{ fontSize: 12 }} />
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
