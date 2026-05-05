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
  Typography,
  message,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import { useAgentStore, useQuotaStore } from '@/store';
import type { QuotaLog } from '@/types/agent';
import { formatNumber } from '@/utils/format';

const QuotaPage = () => {
  const navigate = useNavigate();
  const agents = useAgentStore((state) => state.agents);
  const quotaLogs = useQuotaStore((state) => state.logs);
  const issueQuota = useQuotaStore((state) => state.issueQuota);
  const [form] = Form.useForm();

  const totalIssued = quotaLogs.filter((item) => item.type === '发放').reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = agents.reduce((sum, item) => sum + item.totalIncome, 0);
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
      width: 176,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '代理',
      dataIndex: 'agentName',
      width: 176,
      filters: agents.map((agent) => ({ text: agent.name, value: agent.name })),
      onFilter: (value, record) => record.agentName === value,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          style={{ paddingInline: 0 }}
          onClick={() => navigate(`/agents/${record.agentId}`)}
        >
          {record.agentName}
        </Button>
      ),
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: 104,
      align: 'center',
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => <Typography.Text style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</Typography.Text>,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 140,
    },
    {
      title: '变更后余额',
      dataIndex: 'balanceAfter',
      width: 132,
      align: 'center',
      sorter: (a, b) => a.balanceAfter - b.balanceAfter,
      render: (value) => <Typography.Text style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</Typography.Text>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 320,
      ellipsis: true,
    },
  ];

  return (
    <div className="page-container">
      <PageTitle title="额度管理" subtitle="集中处理代理额度发放，并追踪每一笔额度流水。" />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="section-card">
            <Statistic title="累计发放额度" value={formatNumber(totalIssued)} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="section-card">
            <Statistic title="累计收益" value={formatNumber(totalIncome)} prefix="¥" />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="section-card">
            <Statistic title="当前库存总额" value={formatNumber(currentBalance)} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
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
              scroll={{ x: 1120 }}
              tableLayout="fixed"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QuotaPage;
