import { Card, Input, Select, Space, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { usePromptStore } from '@/store';
import type { PromptItem } from '@/types/prompt';

const PromptListPage = () => {
  const navigate = useNavigate();
  const prompts = usePromptStore((state) => state.prompts);
  const [keyword, setKeyword] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('全部');

  const filteredData = prompts.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.name.includes(keyword) ||
      item.key.includes(keyword) ||
      item.scene.includes(keyword);
    const matchesStatus = statusFilter === '全部' || item.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  const columns: TableColumnsType<PromptItem> = [
    {
      title: 'Prompt 名称',
      dataIndex: 'name',
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Key',
      dataIndex: 'key',
      width: 170,
    },
    {
      title: '使用场景',
      dataIndex: 'scene',
      width: 130,
      filters: [...new Set(prompts.map((item) => item.scene))].map((scene) => ({ text: scene, value: scene })),
      onFilter: (value, record) => record.scene === value,
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '当前版本',
      dataIndex: 'currentVersion',
      width: 100,
      sorter: (a, b) => a.currentVersion - b.currentVersion,
      render: (value) => `v${value}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      filters: ['已上线', '测试中'].map((value) => ({ text: value, value })),
      onFilter: (value, record) => record.status === value,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 170,
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <a
            onClick={(event) => {
              event.preventDefault();
              navigate(`/prompts/${record.id}/edit`);
            }}
          >
            编辑
          </a>
          <a
            onClick={(event) => {
              event.preventDefault();
              navigate(`/prompts/${record.id}/versions`);
            }}
          >
            版本管理
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageTitle title="Prompt 管理" subtitle="管理提示词资产，支持编辑、预览、版本对比和回滚。" />
      <Card className="section-card">
        <div className="table-toolbar">
          <Input.Search
            allowClear
            placeholder="搜索 Prompt 名称 / Key / 场景"
            style={{ width: 300 }}
            onSearch={setKeyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            style={{ width: 160 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['全部', '已上线', '测试中'].map((value) => ({ label: value, value }))}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1380 }}
        />
      </Card>
    </div>
  );
};

export default PromptListPage;
