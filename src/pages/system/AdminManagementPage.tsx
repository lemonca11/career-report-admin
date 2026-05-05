import { LockOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';

import PageTitle from '@/components/PageTitle';
import { useAdminAccountStore } from '@/store';
import type { AdminAccountStatus, AdminUser } from '@/types/admin';
import { getAdminRoleLabel } from '@/utils/auth';

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const statusLabelMap: Record<AdminAccountStatus, string> = {
  active: '启用',
  disabled: '停用',
};

const statusColorMap: Record<AdminAccountStatus, string> = {
  active: 'success',
  disabled: 'default',
};

const AdminManagementPage = () => {
  const adminUsers = useAdminAccountStore((state) => state.adminUsers);
  const createAdminUser = useAdminAccountStore((state) => state.createAdminUser);
  const updateAdminUser = useAdminAccountStore((state) => state.updateAdminUser);
  const resetAdminPassword = useAdminAccountStore((state) => state.resetAdminPassword);
  const toggleAdminUserStatus = useAdminAccountStore((state) => state.toggleAdminUserStatus);

  const [keyword, setKeyword] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | AdminAccountStatus>('all');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<AdminUser | null>(null);
  const [resettingUser, setResettingUser] = React.useState<AdminUser | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const activeSuperAdminCount = adminUsers.filter(
    (item) => item.roleCode === 'SUPER_ADMIN' && item.status === 'active',
  ).length;

  const filteredData = adminUsers.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.name.includes(keyword) ||
      item.username.includes(keyword) ||
      (item.mobile || '').includes(keyword);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesKeyword && matchesStatus;
  });

  const openEditModal = (record: AdminUser) => {
    setEditingUser(record);
    editForm.setFieldsValue({
      username: record.username,
      roleCode: getAdminRoleLabel(record.roleCode),
      name: record.name,
      mobile: record.mobile,
      status: record.status,
    });
  };

  const handleCreate = async () => {
    const values = await createForm.validateFields();
    const result = createAdminUser(values);

    if (!result.success) {
      message.error(result.error || '新增管理员失败');
      return;
    }

    message.success('管理员创建成功');
    setCreateOpen(false);
    createForm.resetFields();
  };

  const handleEdit = async () => {
    if (!editingUser) return;

    const values = await editForm.validateFields();
    const result = updateAdminUser(editingUser.id, values);

    if (!result.success) {
      message.error(result.error || '管理员更新失败');
      return;
    }

    message.success('管理员信息已更新');
    setEditingUser(null);
    editForm.resetFields();
  };

  const handleResetPassword = async () => {
    if (!resettingUser) return;

    const values = await resetForm.validateFields();
    resetAdminPassword(resettingUser.id, values.password);
    message.success('密码已重置并立即生效');
    setResettingUser(null);
    resetForm.resetFields();
  };

  const handleToggleStatus = (record: AdminUser) => {
    const result = toggleAdminUserStatus(record.id);

    if (!result.success) {
      message.error(result.error || '操作失败');
      return;
    }

    message.success(record.status === 'active' ? '管理员已停用' : '管理员已启用');
  };

  const columns: TableColumnsType<AdminUser> = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
      render: (value) => <Typography.Text strong>{value}</Typography.Text>,
    },
    {
      title: '账号',
      dataIndex: 'username',
      width: 140,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 150,
      render: (value) => value || '-',
    },
    {
      title: '角色',
      dataIndex: 'roleCode',
      width: 120,
      render: (value) => (
        <Tag color={value === 'SUPER_ADMIN' ? 'gold' : 'blue'}>{getAdminRoleLabel(value)}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => <Tag color={statusColorMap[value]}>{statusLabelMap[value]}</Tag>,
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginAt',
      width: 172,
      render: (value) => value || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 172,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right',
      render: (_, record) => {
        const isProtectedSuperAdmin =
          record.roleCode === 'SUPER_ADMIN' && record.status === 'active' && activeSuperAdminCount <= 1;

        return (
          <Space size="small" wrap>
            <Button type="link" size="small" style={{ paddingInline: 0 }} onClick={() => openEditModal(record)}>
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              icon={<LockOutlined />}
              style={{ paddingInline: 0 }}
              onClick={() => {
                setResettingUser(record);
                resetForm.resetFields();
              }}
            >
              重置密码
            </Button>
            <Popconfirm
              title={`确认${record.status === 'active' ? '停用' : '启用'}该管理员？`}
              onConfirm={() => handleToggleStatus(record)}
              okText="确认"
              cancelText="取消"
              disabled={isProtectedSuperAdmin}
            >
              <Button
                type="link"
                size="small"
                danger={record.status === 'active'}
                disabled={isProtectedSuperAdmin}
                style={{ paddingInline: 0 }}
              >
                {record.status === 'active' ? '停用' : '启用'}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="page-container">
      <PageTitle
        title="管理员管理"
        subtitle="供超级管理员维护后台账号、启停状态与基础安全信息。"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCreateOpen(true);
              createForm.resetFields();
            }}
          >
            新增管理员
          </Button>
        }
      />

      <Card className="section-card">
        <div className="table-toolbar">
          <Input.Search
            allowClear
            placeholder="搜索姓名 / 账号 / 手机号"
            style={{ width: 280 }}
            value={keyword}
            onSearch={setKeyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { label: '全部状态', value: 'all' },
              { label: '启用', value: 'active' },
              { label: '停用', value: 'disabled' },
            ]}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1320 }}
          tableLayout="fixed"
        />
      </Card>

      <Modal
        title="新增管理员"
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => {
          setCreateOpen(false);
          createForm.resetFields();
        }}
        okText="确认新增"
        cancelText="取消"
      >
        <Form form={createForm} layout="vertical" initialValues={{ roleText: '非超级管理员（固定）' }}>
          <Form.Item label="登录账号" name="username" rules={[{ required: true, message: '请输入登录账号' }]}>
            <Input placeholder="例如：operator001" />
          </Form.Item>
          <Form.Item
            label="初始密码"
            name="password"
            rules={[
              { required: true, message: '请输入初始密码' },
              { pattern: passwordPattern, message: '密码不少于 8 位，且需包含字母和数字' },
            ]}
          >
            <Input.Password placeholder="至少 8 位，包含字母和数字" />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入管理员姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="mobile">
            <Input placeholder="选填" />
          </Form.Item>
          <Form.Item label="角色" name="roleText">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑管理员"
        open={Boolean(editingUser)}
        onOk={handleEdit}
        onCancel={() => {
          setEditingUser(null);
          editForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="登录账号" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="角色" name="roleCode">
            <Input disabled />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号" name="mobile">
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select
              options={[
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={resettingUser ? `重置密码：${resettingUser.name}` : '重置密码'}
        open={Boolean(resettingUser)}
        onOk={handleResetPassword}
        onCancel={() => {
          setResettingUser(null);
          resetForm.resetFields();
        }}
        okText="确认重置"
        cancelText="取消"
      >
        <Form form={resetForm} layout="vertical">
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true, message: '请输入新密码' },
              { pattern: passwordPattern, message: '密码不少于 8 位，且需包含字母和数字' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminManagementPage;
