import React from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Input,
  Avatar,
  Card,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useUserStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types';

const { Title } = Typography;
const { Search } = Input;

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useUserStore();

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => <Avatar src={avatar} />,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
    {
      title: '报告数',
      dataIndex: 'reportCount',
      key: 'reportCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '正常' : '停用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/users/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>用户中心</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Search placeholder="搜索用户昵称/手机号" style={{ width: 300 }} />
      </Card>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Users;
