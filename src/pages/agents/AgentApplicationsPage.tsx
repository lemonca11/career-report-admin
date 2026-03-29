import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Select, Space, Table, Typography, message } from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useAgentStore } from '@/store';
import type { AgentApplication } from '@/types/agent';

const AgentApplicationsPage = () => {
  const applications = useAgentStore((state) => state.applications);
  const approveApplication = useAgentStore((state) => state.approveApplication);
  const rejectApplication = useAgentStore((state) => state.rejectApplication);
  const [keyword, setKeyword] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('全部');
  const [levelFilter, setLevelFilter] = React.useState<string>('全部');

  const filteredData = applications.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.applicantName.includes(keyword) ||
      item.company.includes(keyword) ||
      item.region.includes(keyword);
    const matchesStatus = statusFilter === '全部' || item.status === statusFilter;
    const matchesLevel = levelFilter === '全部' || item.levelRequested === levelFilter;
    return matchesKeyword && matchesStatus && matchesLevel;
  });

  const handleReview = (record: AgentApplication, approved: boolean) => {
    Modal.confirm({
      title: approved ? '确认通过该代理申请？' : '确认驳回该代理申请？',
      content: `${record.applicantName} / ${record.region} / ${record.levelRequested}`,
      okText: approved ? '通过' : '驳回',
      cancelText: '取消',
      onOk: () => {
        if (approved) {
          approveApplication(record.id);
        } else {
          rejectApplication(record.id, '资质不符合要求');
        }
        message.success(`已${approved ? '通过' : '驳回'}申请`);
      },
    });
  };

  const columns: TableColumnsType<AgentApplication> = [
    {
      title: '申请人',
      dataIndex: 'applicantName',
      width: 120,
      sorter: (a, b) => a.applicantName.localeCompare(b.applicantName),
    },
    {
      title: '机构名称',
      dataIndex: 'company',
      ellipsis: true,
    },
    {
      title: '申请区域',
      dataIndex: 'region',
      width: 120,
      filters: [
        { text: '上海', value: '上海' },
        { text: '杭州', value: '杭州' },
        { text: '广州', value: '广州' },
        { text: '深圳', value: '深圳' },
      ],
      onFilter: (value, record) => record.region.includes(String(value)),
    },
    {
      title: '申请级别',
      dataIndex: 'levelRequested',
      width: 130,
      filters: [
        { text: '省级代理', value: '省级代理' },
        { text: '城市代理', value: '城市代理' },
        { text: '校园合伙人', value: '校园合伙人' },
      ],
      onFilter: (value, record) => record.levelRequested === value,
    },
    {
      title: '经验',
      dataIndex: 'experienceYears',
      width: 100,
      sorter: (a, b) => a.experienceYears - b.experienceYears,
      render: (value) => `${value} 年`,
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      width: 170,
      sorter: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space wrap>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => Modal.info({ 
              title: `${record.applicantName} 申请详情`, 
              content: <Typography.Paragraph>{record.note}</Typography.Paragraph> 
            })}
          >
            查看
          </Button>
          {record.status === '待审核' ? (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleReview(record, true)}
              >
                通过
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReview(record, false)}
              >
                驳回
              </Button>
            </>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageTitle title="代理申请审核" subtitle="集中处理代理入驻申请，支持快速审批与状态追踪。" />
      <Card className="section-card">
        <div className="table-toolbar">
          <Input.Search
            allowClear
            placeholder="搜索申请人 / 机构 / 区域"
            style={{ width: 280 }}
            onSearch={setKeyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            style={{ width: 160 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['全部', '待审核', '已通过', '已驳回'].map((value) => ({ label: value, value }))}
          />
          <Select
            style={{ width: 160 }}
            value={levelFilter}
            onChange={setLevelFilter}
            options={['全部', '省级代理', '城市代理', '校园合伙人'].map((value) => ({ label: value, value }))}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  );
};

export default AgentApplicationsPage;
