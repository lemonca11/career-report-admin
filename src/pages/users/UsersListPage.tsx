import { Card, Input, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import { useUserStore } from '@/store';
import type { User } from '@/types/user';

const UsersListPage = () => {
  const navigate = useNavigate();
  const users = useUserStore((state) => state.users);
  const [keyword, setKeyword] = React.useState('');

  const filteredData = users.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.name.includes(keyword) ||
      item.phone.includes(keyword) ||
      item.university.includes(keyword);
    return matchesKeyword;
  });

  const columns: TableColumnsType<User> = [
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      ellipsis: true,
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
      title: '注册时间',
      dataIndex: 'registerAt',
      width: 170,
      sorter: (a, b) => a.registerAt.localeCompare(b.registerAt),
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
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}

        />
      </Card>
    </div>
  );
};

export default UsersListPage;
