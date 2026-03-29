import { SendOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  message,
} from 'antd';
import type { TableColumnsType } from 'antd';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useAgentStore, useQuotaStore } from '@/store';
import type { QuotaLog } from '@/types/agent';
import { formatNumber } from '@/utils/format';

const QuotaPage = () => {
  const agents = useAgentStore((state) => state.agents);
  const quotaLogs = useQuotaStore((state) => state.logs);
  const addLog = useQuotaStore((state) => state.addLog);
  const [form] = Form.useForm();

  const totalIssued = quotaLogs.filter((item) => item.type === '发放').reduce((sum, item) => sum + item.amount, 0);
  const currentBalance = agents.reduce((sum, item) => sum + item.quotaBalance, 0);

  const handleIssue = async () => {
    const values = await form.validateFields();
    issueQuota(values.agentId, Number(values.amount), values.remark);
    message.success('额度发放成功');
    form.resetFields();
  };

  const columns: TableColumnsType<QuotaLog> = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '代理',
      dataIndex: 'agentName',
      width: 180,
      filters: agents.map((agent) => ({ text: agent.name, value: agent.name })),
      onFilter: (value, record) => record.agentName === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      filters: [
        { text: '发放', value: '发放' },
        { text: '扣减', value: '扣减' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 140,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '变更后余额',
      dataIndex: 'balanceAfter',
      width: 120,
      sorter: (a, b) => a.balanceAfter - b.balanceAfter,
    },
  ];

  return (
    <div className="page-container">
      <PageTitle title="额度管理" subtitle="集中处理代理额度发放，并追踪每一笔额度流水。" />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={8}>
          <Card className="section-card">
            <Statistic title="累计发放额度" value={formatNumber(totalIssued)} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card className="section-card">
            <Statistic title="当前库存总额" value={formatNumber(currentBalance)} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card className="section-card">
            <Statistic title="流水记录数" value={quotaLogs.length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} xl={8}>
          <Card className="section-card" title="额度发放">
            <Form form={form} layout="vertical" initialValues={{ amount: 100 }}>
              <Form.Item label="代理对象" name="agentId" rules={[{ required: true, message: '请选择代理' }]}>
                <Select
                  showSearch
                  placeholder="选择代理"
                  options={agents.map((agent) => ({ label: `${agent.name} (${agent.level})`, value: agent.id }))}
                />
              </Form.Item>
              <Form.Item label="发放数量" name="amount" rules={[{ required: true, message: '请输入额度' }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="备注" name="remark" rules={[{ required: true, message: '请输入备注' }]}>
                <Input.TextArea rows={4} placeholder="例如：春招冲刺专项额度" />
              </Form.Item>
              <Space>
                <Button type="primary" icon={<SendOutlined />} onClick={handleIssue}>
                  确认发放
                </Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
              </Space>
            </Form>
          </Card>
        </Col>
        <Col xs={24} xl={16}>
          <Card className="section-card" title="额度流水记录">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={quotaLogs}
              pagination={{ pageSize: 7, showSizeChanger: false }}
              scroll={{ x: 1100 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QuotaPage;
