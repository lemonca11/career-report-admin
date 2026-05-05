import { Card, Space, Statistic, Typography } from 'antd';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  to?: string;
}

const MetricCard = ({ title, value, description, icon, to }: MetricCardProps) => {
  const cardContent = (
    <Card
      className="metric-card"
      style={to ? { cursor: 'pointer' } : undefined}
      hoverable={!!to}
    >
      <Space align="start" className="metric-card__header">
        <Statistic className="metric-card__stat" title={title} value={value} />
        <div className="metric-card__icon">{icon}</div>
      </Space>
      <Typography.Text className="metric-card__description">{description}</Typography.Text>
    </Card>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default MetricCard;
