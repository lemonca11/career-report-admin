import { Typography, Space } from 'antd';
import type { ReactNode } from 'react';

const { Title } = Typography;

interface PageTitleProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

const PageTitle = ({ title, subtitle, extra }: PageTitleProps) => (
  <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <Title level={4} style={{ marginBottom: subtitle ? 8 : 0 }}>{title}</Title>
      {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
    </div>
    {extra && <Space>{extra}</Space>}
  </div>
);

export default PageTitle;
