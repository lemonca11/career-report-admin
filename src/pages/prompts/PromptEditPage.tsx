import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Form, Input, Row, Space, Tag, Typography, message } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import { usePromptStore, useUserStore } from '@/store';
import { renderTemplate } from '@/utils/template';

const PromptEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const prompts = usePromptStore((state) => state.prompts);
  const users = useUserStore((state) => state.users);
  const updatePrompt = usePromptStore((state) => state.updatePrompt);
  const prompt = prompts.find((item) => item.id === id);
  const [form] = Form.useForm();
  const content = Form.useWatch('content', form);
  const previewGoal = Form.useWatch('previewGoal', form);
  const sampleUser = users[0];

  React.useEffect(() => {
    if (prompt) {
      form.setFieldsValue({
        content: prompt.content,
        notes: `更新 ${prompt.name} 输出结构`,
        previewGoal: sampleUser?.careerDirection,
      });
    }
  }, [form, prompt, sampleUser?.careerDirection]);

  if (!prompt || !sampleUser) {
    return (
      <div className="page-container">
        <Empty description="未找到对应 Prompt" />
      </div>
    );
  }

  const previewText = renderTemplate(content || prompt.content, {
    user: sampleUser,
    careerGoal: previewGoal || sampleUser.careerDirection,
  });

  const handleSave = async () => {
    const values = await form.validateFields();
    updatePrompt(prompt.id, values.content);
    message.success('Prompt 已保存，新版本已生成');
  };

  return (
    <div className="page-container">
      <PageTitle
        title={`编辑 ${prompt.name}`}
        subtitle="调整 Prompt 内容并实时预览变量替换结果。"
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/prompts/list')}>
              返回
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              保存并生成版本
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card className="section-card" title="Prompt 编辑">
            <Form form={form} layout="vertical">
              <Form.Item label="Prompt Key">
                <Input value={prompt.key} disabled />
              </Form.Item>
              <Form.Item label="版本说明" name="notes" rules={[{ required: true, message: '请输入版本说明' }]}>
                <Input placeholder="例如：增强输出结构与风控提示" />
              </Form.Item>
              <Form.Item label="Prompt 内容" name="content" rules={[{ required: true, message: '请输入 Prompt 内容' }]}>
                <Input.TextArea rows={20} placeholder="请输入 Prompt 内容" />
              </Form.Item>
              <Form.Item label="测试职业方向" name="previewGoal">
                <Input placeholder="例如：产品经理 / 数据分析师" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card className="section-card" title="测试预览">
            <Space wrap style={{ marginBottom: 12 }}>
              <Tag color="processing">姓名：{sampleUser.name}</Tag>
              <Tag color="processing">学校：{sampleUser.university}</Tag>
              <Tag color="processing">专业：{sampleUser.major}</Tag>
              <Tag color="processing">目标：{previewGoal || sampleUser.careerDirection}</Tag>
            </Space>
            <Typography.Paragraph className="prompt-preview">{previewText}</Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PromptEditPage;
