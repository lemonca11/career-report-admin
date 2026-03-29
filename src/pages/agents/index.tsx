import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useAgentStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import type { Agent, AgentLevel } from '../../types';

const { Title, Text } = Typography;

const levelMap: Record<AgentLevel, { text: string; color: string }> = {
  strategic: { text: '战略代理', color: 'purple' },
  city: { text: '城市代理', color: 'blue' },
  campus: { text: '校园代理', color: 'green' },
};

const Agents: React.FC = () => {
  const navigate = useNavigate();
  const { agents, grantQuota, toggleAgentStatus } = useAgentStore();
  const [isQuotaModalVisible, setIsQuotaModalVisible] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [quotaForm] = Form.useForm();

  const handleGrantQuota = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsQuotaModalVisible(true);
    quotaForm.setFieldsValue({ quantity: 100 });
  };

  const handleQuotaSubmit = async () => {
    try {
      const values = await quotaForm.validateFields();
      if (selectedAgent) {
        grantQuota(selectedAgent.id, values.quantity);
        message.success(`成功发放 ${values.quantity} 份额度给 ${selectedAgent.userName}`);
        setIsQuotaModalVisible(false);
      }
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleToggleStatus = (agent: Agent) => {
    Modal.confirm({
      title: `确认${agent.status === 'active' ? '停用' : '启用'}该代理？`,
      content: `代理：${agent.userName}（${levelMap[agent.agentLevel].text}）`,
      onOk() {
        toggleAgentStatus(agent.id);
        message.success(`代理已${agent.status === 'active' ? '停用' : '启用'}`);
      },
    });
  };

  const columns = [
    {
      title: '代理ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '层级',
      dataIndex: 'agentLevel',
      key: 'agentLevel',
      render: (level: AgentLevel) => (
        <Tag color={levelMap[level].color}>{levelMap[level].text}</Tag>
      ),
    },
    {
      title: '上级代理',
      dataIndex: 'parentAgentName',
      key: 'parentAgentName',
      render: (text: string) => text || '-',
    },
    {
      title: '剩余额度',
      dataIndex: 'quotaRemain',
      key: 'quotaRemain',
      render: (quota: number, record: Agent) => (
        <Text type={quota < 20 ? 'danger' : undefined}>
          {quota} / {record.quotaTotal}
        </Text>
      ),
    },
    {
      title: '已售份数',
      dataIndex: 'soldCount',
      key: 'soldCount',
    },
    {
      title: '收益余额',
      dataIndex: 'incomeBalance',
      key: 'incomeBalance',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '正常' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Agent) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/agents/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => handleGrantQuota(record)}
          >
            发额度
          </Button>
          <Button
            type="link"
            danger={record.status === 'active'}
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? '停用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  const stats = {
    total: agents.length,
    strategic: agents.filter((a) => a.agentLevel === 'strategic').length,
    city: agents.filter((a) => a.agentLevel === 'city').length,
    campus: agents.filter((a) => a.agentLevel === 'campus').length,
    active: agents.filter((a) => a.status === 'active').length,
  };

  return (
    <div>
      <Title level={4}>代理列表</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="总代理数" value={stats.total} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="战略代理" value={stats.strategic} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="城市代理" value={stats.city} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="校园代理" value={stats.campus} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="正常运营" value={stats.active} />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={agents}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="发放额度"
        open={isQuotaModalVisible}
        onOk={handleQuotaSubmit}
        onCancel={() => setIsQuotaModalVisible(false)}
      >
        {selectedAgent && (
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>代理：</strong>
              {selectedAgent.userName}（{levelMap[selectedAgent.agentLevel].text}）
            </p>
            <p>
              <strong>当前额度：</strong>
              {selectedAgent.quotaRemain} / {selectedAgent.quotaTotal}
            </p>
          </div>
        )}
        <Form form={quotaForm} layout="vertical">
          <Form.Item
            name="quantity"
            label="发放数量"
            rules={[{ required: true, message: '请输入发放数量' }]}
          >
            <InputNumber min={1} max={10000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="可选填" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Agents;
