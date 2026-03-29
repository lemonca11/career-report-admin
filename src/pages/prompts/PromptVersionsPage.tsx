import { ArrowLeftOutlined, HistoryOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Select, Space, Table, Tag, Typography, message } from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import { usePromptStore } from '@/store';
import type { PromptVersion } from '@/types/prompt';
import { buildTextDiff } from '@/utils/diff';

const PromptVersionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const prompts = usePromptStore((state) => state.prompts);
  const publishPrompt = usePromptStore((state) => state.publishPrompt);
  const prompt = prompts.find((item) => item.id === id);
  const [leftVersion, setLeftVersion] = React.useState<number>();
  const [rightVersion, setRightVersion] = React.useState<number>();

  React.useEffect(() => {
    if (!prompt) {
      return;
    }

    const sortedVersions = [...prompt.versions].sort((a, b) => b.version - a.version);
    setLeftVersion(sortedVersions[0]?.version);
    setRightVersion(sortedVersions[1]?.version ?? sortedVersions[0]?.version);
  }, [prompt]);

  if (!prompt) {
    return (
      <div className="page-container">
        <Empty description="未找到对应 Prompt" />
      </div>
    );
  }

  const versions = [...prompt.versions].sort((a, b) => b.version - a.version);
  const left = versions.find((item) => item.version === leftVersion) || versions[0];
  const right = versions.find((item) => item.version === rightVersion) || versions[1] || versions[0];
  const diffLines = buildTextDiff(left.content, right.content);

  const columns: TableColumnsType<PromptVersion> = [
    {
      title: '版本号',
      dataIndex: 'version',
      width: 100,
      sorter: (a, b) => a.version - b.version,
      render: (value) => `v${value}`,
    },
    {
      title: '版本说明',
      dataIndex: 'notes',
    },
    {
      title: '更新人',
      dataIndex: 'operator',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 170,
    },
    {
      title: '状态',
      dataIndex: 'isCurrent',
      width: 100,
      render: (value) => <Tag color={value ? 'green' : 'default'}>{value ? '当前版本' : '历史版本'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space wrap>
          <a
            onClick={(event) => {
              event.preventDefault();
              setLeftVersion(record.version);
            }}
          >
            设为对比版本 A
          </a>
          <a
            onClick={(event) => {
              event.preventDefault();
              setRightVersion(record.version);
            }}
          >
            设为对比版本 B
          </a>
          <a
            onClick={(event) => {
              event.preventDefault();
              rollbackPrompt(prompt.id, record.version);
              message.success(`已基于 v${record.version} 创建回滚版本`);
            }}
          >
            回滚
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageTitle
        title={`${prompt.name} 版本管理`}
        subtitle="查看历史版本、对比差异，并可将任意版本回滚为最新版本。"
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/prompts/list')}>
              返回
            </Button>
            <Button type="primary" icon={<HistoryOutlined />} onClick={() => navigate(`/prompts/${prompt.id}/edit`)}>
              前往编辑
            </Button>
          </Space>
        }
      />

      <Card className="section-card" title="历史版本">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={versions}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          scroll={{ x: 1180 }}
        />
      </Card>

      <Card
        className="section-card"
        title="版本差异"
        style={{ marginTop: 16 }}
        extra={
          <Space wrap>
            <Select
              style={{ width: 160 }}
              value={left.version}
              onChange={setLeftVersion}
              options={versions.map((item) => ({ label: `版本 A · v${item.version}`, value: item.version }))}
            />
            <SwapOutlined />
            <Select
              style={{ width: 160 }}
              value={right.version}
              onChange={setRightVersion}
              options={versions.map((item) => ({ label: `版本 B · v${item.version}`, value: item.version }))}
            />
          </Space>
        }
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            当前对比：版本 A 为 v{left.version}，版本 B 为 v{right.version}
          </Typography.Text>
          <div className="diff-viewer">
            {diffLines.map((line) => (
              <div key={line.key} className={`diff-row ${line.type}`}>
                <div className="diff-line diff-line--index">{line.key}</div>
                <div className="diff-line diff-line--left">{line.left || ' '}</div>
                <div className="diff-line diff-line--right">{line.right || ' '}</div>
              </div>
            ))}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default PromptVersionsPage;
