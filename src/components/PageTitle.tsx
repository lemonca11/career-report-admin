import { Typography, Space } from 'antd';
import type { ReactNode } from 'react';

const { Title } = Typography;

interface PageTitleProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

const PageTitle = ({ title, subtitle, extra }: PageTitleProps) => (
  <div className="page-title">
    <div className="page-title__main">
      <Title level={4} className="page-title__heading">
        {title}
      </Title>
      {subtitle ? <Typography.Text className="page-title__subtitle">{subtitle}</Typography.Text> : null}
    </div>
    {extra ? <Space className="page-title__extra">{extra}</Space> : null}
  </div>
);

export default PageTitle;
