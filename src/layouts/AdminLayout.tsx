import {
  AppstoreOutlined,
  BgColorsOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { message, Popconfirm } from 'antd';
import { Avatar, Breadcrumb, Button, Grid, Layout, Menu, Segmented, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useThemeStore } from '@/store/themeStore';

const { Content, Header, Sider } = Layout;

const menuItems: MenuProps['items'] = [
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
      { key: '/agents/applications', label: '申请审核' },
      { key: '/agents/list', label: '代理列表' },
    ],
  },
  {
    key: '/quota',
    icon: <WalletOutlined />,
    label: '额度管理',
  },
  {
    key: '/orders',
    icon: <OrderedListOutlined />,
    label: '订单中心',
    children: [{ key: '/orders/list', label: '订单列表' }],
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: '用户中心',
    children: [{ key: '/users/list', label: '用户列表' }],
  },
  {
    key: '/prompts',
    icon: <BgColorsOutlined />,
    label: 'Prompt管理',
    children: [{ key: '/prompts/list', label: 'Prompt列表' }],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
];

const getSelectedMenuKey = (pathname: string) => {
  if (pathname.startsWith('/agents/applications')) return '/agents/applications';
  if (pathname.startsWith('/agents')) return '/agents/list';
  if (pathname.startsWith('/quota')) return '/quota';
  if (pathname.startsWith('/orders')) return '/orders/list';
  if (pathname.startsWith('/users')) return '/users/list';
  if (pathname.startsWith('/prompts')) return '/prompts/list';
  if (pathname.startsWith('/settings')) return '/settings';
  return '/dashboard';
};

const getOpenMenuKey = (pathname: string) => {
  if (pathname.startsWith('/agents')) return '/agents';
  if (pathname.startsWith('/orders')) return '/orders';
  if (pathname.startsWith('/users')) return '/users';
  if (pathname.startsWith('/prompts')) return '/prompts';
  return '';
};

const getBreadcrumbItems = (pathname: string) => {
  if (pathname.startsWith('/dashboard')) return ['控制台'];
  if (pathname.startsWith('/agents/applications')) return ['代理管理', '申请审核'];
  if (pathname.startsWith('/agents/list')) return ['代理管理', '代理列表'];
  if (pathname.startsWith('/agents/')) return ['代理管理', '代理详情'];
  if (pathname.startsWith('/quota')) return ['额度管理'];
  if (pathname.startsWith('/orders/list')) return ['订单中心', '订单列表'];
  if (pathname.startsWith('/orders/')) return ['订单中心', '订单详情'];
  if (pathname.startsWith('/users/list')) return ['用户中心', '用户列表'];
  if (pathname.startsWith('/users/')) return ['用户中心', '用户详情'];
  if (pathname.startsWith('/prompts/list')) return ['Prompt管理', 'Prompt列表'];
  if (pathname.includes('/edit')) return ['Prompt管理', 'Prompt编辑'];
  if (pathname.includes('/versions')) return ['Prompt管理', '版本管理'];
  if (pathname.startsWith('/settings')) return ['系统设置'];
  return ['页面'];
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const screens = Grid.useBreakpoint();
  const { themeMode, setThemeMode } = useThemeStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    message.success('已退出登录');
    navigate('/login');
  };

  React.useEffect(() => {
    if (!screens.lg) {
      setCollapsed(true);
    }
  }, [screens.lg]);

  React.useEffect(() => {
    const key = getOpenMenuKey(pathname);
    setOpenKeys(key ? [key] : []);
  }, [pathname]);

  return (
    <Layout className="admin-layout">
      <Sider
        breakpoint="lg"
        collapsed={collapsed}
        collapsedWidth={screens.xs ? 0 : 72}
        width={250}
        onCollapse={setCollapsed}
        className="admin-sider"
        trigger={null}
      >
        <div className="admin-logo">
          <div className="admin-logo__mark">
            <AppstoreOutlined />
          </div>
          {!collapsed ? (
            <Space direction="vertical" size={0}>
              <Typography.Text className="admin-logo__title">Career OS</Typography.Text>
              <Typography.Text className="admin-logo__subtitle">职业规划报告系统</Typography.Text>
            </Space>
          ) : null}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[getSelectedMenuKey(pathname)]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          items={menuItems}
          onClick={({ key }) => {
            navigate(String(key));
            if (!screens.lg) {
              setCollapsed(true);
            }
          }}
          style={{ background: 'transparent', borderInlineEnd: 'none' }}
        />
      </Sider>
      <Layout style={{ background: 'transparent' }}>
        <Header className="admin-header">
          <Space size={12}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
            />
            <Breadcrumb items={getBreadcrumbItems(pathname).map((title) => ({ title }))} />
          </Space>
          <Space size={16}>
            <Segmented
              size="small"
              value={themeMode}
              onChange={(value) => setThemeMode(value as 'light' | 'dark')}
              options={[
                { label: '浅色', value: 'light' },
                { label: '深色', value: 'dark' },
              ]}
            />
            <Space size={8}>
              <Avatar size="small" icon={<UserOutlined />} />
              {!screens.xs ? <Typography.Text>运营管理员</Typography.Text> : null}
            </Space>
            <Popconfirm
              title="确认退出登录？"
              onConfirm={handleLogout}
              okText="确认"
              cancelText="取消"
            >
              <Button type="text" icon={<LogoutOutlined />}>
                退出
              </Button>
            </Popconfirm>
          </Space>
        </Header>
        <Content className="admin-content">
          <div className="content-shell">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
