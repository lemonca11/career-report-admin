import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Select, Space, Table, Typography, message, Form } from 'antd';
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
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);
  const [levelFilter, setLevelFilter] = React.useState<string | undefined>(undefined);
  
  // 驳回弹窗状态
  const [rejectModalVisible, setRejectModalVisible] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);
  const [currentRecord, setCurrentRecord] = React.useState<AgentApplication | null>(null);
  const [rejectReason, setRejectReason] = React.useState('');
  const [form] = Form.useForm();

  const filteredData = applications.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.applicantName.includes(keyword) ||
      item.company.includes(keyword) ||
      item.region.includes(keyword);
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesLevel = !levelFilter || item.levelRequested === levelFilter;
    return matchesKeyword && matchesStatus && matchesLevel;
  });

  // 处理筛选器选择变化
  const handleStatusChange = (value: string) => {
    setStatusFilter(value || undefined);
  };

  const handleLevelChange = (value: string) => {
    setLevelFilter(value || undefined);
  };

  const handleApprove = (record: AgentApplication) => {
    Modal.confirm({
      title: '确认通过该代理申请？',
      content: `${record.applicantName} / ${record.region} / ${record.levelRequested}`,
      okText: '通过',
      cancelText: '取消',
      onOk: () => {
        approveApplication(record.id);
        message.success('已通过申请');
      },
    });
  };

  const handleRejectClick = (record: AgentApplication) => {
    setCurrentRecord(record);
    setRejectReason('');
    form.resetFields();
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    try {
      await form.validateFields();
      if (!currentRecord) return;
      
      setRejectLoading(true);
      rejectApplication(currentRecord.id, rejectReason);
      message.success('已驳回申请');
      setRejectModalVisible(false);
      setCurrentRecord(null);
      setRejectReason('');
    } finally {
      setRejectLoading(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectModalVisible(false);
    setCurrentRecord(null);
    setRejectReason('');
    form.resetFields();
  };

  const columns: TableColumnsType<AgentApplication> = [
    {
      title: '申请人',
      dataIndex: 'applicantName',
      width: 100,
      sorter: (a, b) => a.applicantName.localeCompare(b.applicantName),
    },
    {
      title: '机构名称',
      dataIndex: 'company',
      width: 140,
      ellipsis: true,
    },
    {
      title: '申请区域',
      dataIndex: 'region',
      width: 100,
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
      width: 110,
      filters: [
        { text: '省级代理', value: '省级代理' },
        { text: '城市代理', value: '城市代理' },
        { text: '校园合伙人', value: '校园合伙人' },
      ],
      onFilter: (value, record) => record.levelRequested === value,
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      width: 160,
      sorter: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
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
                onClick={() => handleApprove(record)}
              >
                通过
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectClick(record)}
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
            placeholder="审核状态"
            allowClear
            onChange={handleStatusChange}
            options={[
              { label: '待审核', value: '待审核' },
              { label: '已通过', value: '已通过' },
              { label: '已驳回', value: '已驳回' },
            ]}
          />
          <Select
            style={{ width: 160 }}
            value={levelFilter}
            placeholder="申请级别"
            allowClear
            onChange={handleLevelChange}
            options={[
              { label: '省级代理', value: '省级代理' },
              { label: '城市代理', value: '城市代理' },
              { label: '校园合伙人', value: '校园合伙人' },
            ]}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 驳回弹窗 */}
      <Modal
        title="驳回代理申请"
        open={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={handleRejectCancel}
        okText="确认驳回"
        cancelText="取消"
        confirmLoading={rejectLoading}
        okButtonProps={{ danger: true }}
      >
        {currentRecord && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>申请人：</strong>{currentRecord.applicantName}</p>
            <p><strong>区域：</strong>{currentRecord.region}</p>
            <p><strong>申请级别：</strong>{currentRecord.levelRequested}</p>
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item
            label="驳回理由"
            name="reason"
            rules={[{ required: true, message: '请输入驳回理由' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入驳回理由（如：资质不符合要求、区域已有代理等）"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentApplicationsPage;
