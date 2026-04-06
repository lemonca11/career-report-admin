import React from 'react';
import {
  Table,
  Button,
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
      width: 90,
      ellipsis: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 56,
      align: 'center' as const,
      render: (avatar: string) => <Avatar src={avatar} size="small" />,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      minWidth: 100,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 115,
    },
    {
      title: '订单',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 56,
      align: 'center' as const,
    },
    {
      title: '报告',
      dataIndex: 'reportCount',
      key: 'reportCount',
      width: 56,
      align: 'center' as const,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 68,
      align: 'center' as const,
      render: (status: string) => (
        <Tag 
          color={status === 'active' ? 'success' : 'default'} 
          style={{ margin: 0, fontSize: 12 }}
        >
          {status === 'active' ? '正常' : '停用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      width: 145,
      render: (date: string) => new Date(date).toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      title: '操作',
      key: 'action',
      width: 70,
      fixed: 'right',
      align: 'center' as const,
      render: (_: unknown, record: User) => (
        <Button
          type="link"
          size="small"
          style={{ padding: '0 4px' }}
          icon={<EyeOutlined />}
          onClick={() => navigate(`/users/${record.id}`)}
        >
          查看
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
        scroll={{ x: 740 }}
        size="small"
      />
    </div>
  );
};

export default Users;