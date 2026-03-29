import { Card, Input, Select, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useUserStore } from '@/store';
import type { User } from '@/types/user';

const UsersListPage = () => {
  const navigate = useNavigate();
  const users = useUserStore((state) => state.users);
  const [keyword, setKeyword] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('全部');

  const filteredData = users.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.name.includes(keyword) ||
      item.phone.includes(keyword) ||
      item.university.includes(keyword);
    const matchesStatus = statusFilter === '全部' || item.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  const columns: TableColumnsType<User> = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '学校',
      dataIndex: 'university',
      width: 160,
    },
    {
      title: '专业',
      dataIndex: 'major',
      width: 160,
    },
    {
      title: '年级',
      dataIndex: 'grade',
      width: 100,
    },
    {
      title: '职业方向',
      dataIndex: 'careerDirection',
      width: 140,
    },
    {
      title: '订单数',
      dataIndex: 'totalOrders',
      width: 100,
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: '报告数',
      dataIndex: 'reportCount',
      width: 100,
      sorter: (a, b) => a.reportCount - b.reportCount,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      filters: ['活跃', '沉默'].map((value) => ({ text: value, value })),
      onFilter: (value, record) => record.status === value,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '最近活跃',
      dataIndex: 'lastActiveAt',
      width: 170,
      sorter: (a, b) => a.lastActiveAt.localeCompare(b.lastActiveAt),
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <a
          onClick={(event) => {
            event.preventDefault();
            navigate(`/users/${record.id}`);
          }}
        >
          查看详情
        </a>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageTitle title="用户中心" subtitle="管理用户档案、订单记录和报告产出情况。" />
      <Card className="section-card">
        <div className="table-toolbar">
          <Input.Search
            allowClear
            placeholder="搜索姓名 / 手机号 / 学校"
            style={{ width: 280 }}
            onSearch={setKeyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            style={{ width: 160 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['全部', '活跃', '沉默'].map((value) => ({ label: value, value }))}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1300 }}
        />
      </Card>
    </div>
  );
};

export default UsersListPage;
