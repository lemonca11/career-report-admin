import { PauseCircleOutlined, PlusOutlined, RightCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useAgentStore } from '@/store';
import type { Agent } from '@/types/agent';

const AgentsListPage = () => {
  const navigate = useNavigate();
  const agents = useAgentStore((state) => state.agents);
  const grantQuota = useAgentStore((state) => state.grantQuota);
  const toggleAgentStatus = useAgentStore((state) => state.toggleAgentStatus);
  const [keyword, setKeyword] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('全部');
  const [levelFilter, setLevelFilter] = React.useState<string>('全部');
  const [issueTarget, setIssueTarget] = React.useState<Agent | null>(null);
  const [form] = Form.useForm();

  const filteredData = agents.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.name.includes(keyword) ||
      item.region.includes(keyword) ||
      item.contact.includes(keyword) ||
      item.code.includes(keyword);
    const matchesStatus = statusFilter === '全部' || item.status === statusFilter;
    const matchesLevel = levelFilter === '全部' || item.level === levelFilter;
    return matchesKeyword && matchesStatus && matchesLevel;
  });

  const openIssueModal = (agent: Agent) => {
    setIssueTarget(agent);
    form.setFieldsValue({ amount: 100, remark: '月度销售激励额度' });
  };

  const handleIssueQuota = async () => {
    const values = await form.validateFields();
    if (!issueTarget) {
      return;
    }

    grantQuota(issueTarget.id, Number(values.amount));
    message.success(`已向 ${issueTarget.name} 发放额度`);
    setIssueTarget(null);
    form.resetFields();
  };

  const handleToggleStatus = (record: Agent) => {
    Modal.confirm({
      title: `确认${record.status === '启用' ? '停用' : '启用'}该代理？`,
      content: `${record.name} / 当前状态：${record.status}`,
      okText: record.status === '启用' ? '停用' : '启用',
      cancelText: '取消',
      onOk: () => {
        toggleAgentStatus(record.id);
        message.success('代理状态已更新');
      },
    });
  };

  const columns: TableColumnsType<Agent> = [
    {
      title: '代理名称',
      dataIndex: 'name',
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 120,
      filters: [
        { text: '省级代理', value: '省级代理' },
        { text: '城市代理', value: '城市代理' },
        { text: '校园合伙人', value: '校园合伙人' },
      ],
      onFilter: (value, record) => record.level === value,
    },
    {
      title: '所属区域',
      dataIndex: 'region',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 100,
    },
    {
      title: '团队规模',
      dataIndex: 'teamSize',
      width: 110,
      sorter: (a, b) => a.teamSize - b.teamSize,
    },
    {
      title: '当前额度',
      dataIndex: 'quotaBalance',
      width: 120,
      sorter: (a, b) => a.quotaBalance - b.quotaBalance,
    },
    {
      title: '总订单数',
      dataIndex: 'totalOrders',
      width: 120,
      sorter: (a, b) => a.totalOrders - b.totalOrders,
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
      width: 260,
      render: (_, record) => (
        <Space wrap>
          <Button size="small" type="link" onClick={() => navigate(`/agents/${record.id}`)}>
            查看详情
          </Button>
          <Button size="small" icon={<PlusOutlined />} onClick={() => openIssueModal(record)}>
            发放额度
          </Button>
          <Button size="small" icon={<PauseCircleOutlined />} onClick={() => handleToggleStatus(record)}>
            {record.status === '启用' ? '停用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageTitle
        title="代理列表"
        subtitle="管理各层级代理的基础信息、额度库存和运营状态。"
        extra={
          <Button type="primary" icon={<RightCircleOutlined />} onClick={() => navigate('/quota')}>
            前往额度中心
          </Button>
        }
      />
      <Card className="section-card">
        <div className="table-toolbar">
          <Input.Search
            allowClear
            placeholder="搜索代理名称 / 编码 / 联系人"
            style={{ width: 280 }}
            onSearch={setKeyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            style={{ width: 160 }}
            value={levelFilter}
            onChange={setLevelFilter}
            options={['全部', '省级代理', '城市代理', '校园合伙人'].map((value) => ({ label: value, value }))}
          />
          <Select
            style={{ width: 160 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['全部', '启用', '停用'].map((value) => ({ label: value, value }))}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={issueTarget ? `向 ${issueTarget.name} 发放额度` : '发放额度'}
        open={Boolean(issueTarget)}
        onOk={handleIssueQuota}
        onCancel={() => {
          setIssueTarget(null);
          form.resetFields();
        }}
        okText="确认发放"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="发放额度" name="amount" rules={[{ required: true, message: '请输入额度数量' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="备注" name="remark" rules={[{ required: true, message: '请输入备注' }]}>
            <Input.TextArea rows={3} placeholder="例如：季度扩张支持额度" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentsListPage;
