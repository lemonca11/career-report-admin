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
      title: '姓名',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 120,
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '报告数',
      dataIndex: 'reportCount',
      key: 'reportCount',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      width: 150,
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
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: User) => (
        <Button
          type="link"
          size="small"
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
        scroll={{ x: 650 }}
        size="small"
      />
    </div>
  );
};

export default Users;