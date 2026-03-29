import React from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Card,
} from 'antd';
import { EditOutlined, EyeOutlined, HistoryOutlined } from '@ant-design/icons';
import { usePromptStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import type { Prompt } from '../../types';

const { Title, Text } = Typography;

const Prompts: React.FC = () => {
  const navigate = useNavigate();
  const { prompts } = usePromptStore();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => <Text code>{key}</Text>,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: number) => <Tag>v{version}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? 'success' : 'warning'}>
          {isPublished ? '已发布' : '未发布'}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Prompt) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/prompts/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<EyeOutlined />}
          >
            预览
          </Button>
          <Button
            type="link"
            icon={<HistoryOutlined />}
          >
            版本
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Prompt管理</Title>
      
      <Card>
        <Table
          columns={columns}
          dataSource={prompts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Prompts;
