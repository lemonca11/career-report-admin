import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
  message,
  Typography,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAgentStore, useQuotaStore } from '../../store';
import type { QuotaChangeType } from '../../types';

const { Title } = Typography;
const { Option } = Select;

const Quota: React.FC = () => {
  const { agents } = useAgentStore();
  const { logs, addLog } = useQuotaStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleGrant = async () => {
    try {
      const values = await form.validateFields();
      const agent = agents.find((a) => a.id === values.agentId);
      if (agent) {
        const newLog = {
          id: `log_${Date.now()}`,
          toAgentId: agent.id,
          toAgentName: agent.userName,
          changeType: 'platform_grant' as QuotaChangeType,
          quantity: values.quantity,
          remark: values.remark || '平台发放',
          createdAt: new Date().toISOString(),
        };
        addLog(newLog);
        message.success(`成功发放 ${values.quantity} 份额度给 ${agent.userName}`);
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: '流水号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '代理',
      dataIndex: 'toAgentName',
      key: 'toAgentName',
    },
    {
      title: '类型',
      dataIndex: 'changeType',
      key: 'changeType',
      render: (type: QuotaChangeType) => {
        const map: Record<string, { text: string; color: string }> = {
          platform_grant: { text: '平台发放', color: 'blue' },
          distribute: { text: '下级分配', color: 'green' },
          sale_deduct: { text: '销售扣减', color: 'red' },
        };
        const { text, color } = map[type] || { text: type, color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <span style={{ color: quantity > 0 ? '#52c41a' : '#cf1322' }}>
          {quantity > 0 ? `+${quantity}` : quantity}
        </span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4} style={{ margin: 0 }}>额度管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          发放额度
        </Button>
      </Space>

      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="发放额度"
        open={isModalVisible}
        onOk={handleGrant}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="agentId"
            label="选择代理"
            rules={[{ required: true, message: '请选择代理' }]}
          >
            <Select placeholder="请选择代理">
              {agents.map((agent) => (
                <Option key={agent.id} value={agent.id}>
                  {agent.userName} ({agent.mobile}) - 剩余{agent.quotaRemain}份
                </Option>
              ))}
            </Select>
          </Form.Item>
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

export default Quota;
