import { Card, Space, Statistic, Typography } from 'antd';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

const MetricCard = ({ title, value, description, icon }: MetricCardProps) => (
  <Card className="metric-card">
    <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
      <Statistic title={title} value={value} />
      <div className="metric-card__icon">{icon}</div>
    </Space>
    <Typography.Text type="secondary">{description}</Typography.Text>
  </Card>
);

export default MetricCard;
