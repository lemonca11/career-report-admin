import { PlusOutlined, RightCircleOutlined } from '@ant-design/icons';
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

import { useAgentStore } from '@/store';
import type { Agent } from '@/types/agent';

const AgentsListPage = () => {
  const navigate = useNavigate();
  const agents = useAgentStore((state) => state.agents);
  const grantQuota = useAgentStore((state) => state.grantQuota);
  const toggleAgentStatus = useAgentStore((state) => state.toggleAgentStatus);
  const [keyword, setKeyword] = React.useState('');
  const [levelFilter, setLevelFilter] = React.useState<string | undefined>(undefined);
  const [issueTarget, setIssueTarget] = React.useState<Agent | null>(null);
  const [form] = Form.useForm();

  const filteredData = agents.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.name.includes(keyword) ||
      item.region.includes(keyword) ||
      item.contact.includes(keyword) ||
      item.code.includes(keyword);
    const matchesLevel = !levelFilter || item.level === levelFilter;
    return matchesKeyword && matchesLevel;
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '级别',
      dataIndex: 'level',
      filters: [
        { text: '战略代理', value: '战略代理' },
        { label: '城市代理', value: '城市代理' },
        { label: '校园代理', value: '校园代理' },
      ],
      onFilter: (value, record) => record.level === value,
    },
    {
      title: '所属区域',
      dataIndex: 'region',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
    },
    {
      title: '团队规模',
      dataIndex: 'teamSize',
      sorter: (a, b) => a.teamSize - b.teamSize,
    },
    {
      title: '当前额度',
      dataIndex: 'quotaBalance',
      sorter: (a, b) => a.quotaBalance - b.quotaBalance,
    },
    {
      title: '总订单数',
      dataIndex: 'totalOrders',
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space wrap>
          <Button size="small" type="link" onClick={() => navigate(`/agents/${record.id}`)}>
            查看详情
          </Button>
          <Button size="small" icon={<PlusOutlined />} onClick={() => openIssueModal(record)}>
            发放额度
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
            placeholder="申请级别"
            allowClear
            onChange={(value) => setLevelFilter(value || undefined)}
            options={[
              { label: '战略代理', value: '战略代理' },
              { label: '城市代理', value: '城市代理' },
              { label: '校园代理', value: '校园代理' },
            ]}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 6, showSizeChanger: false }}
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
