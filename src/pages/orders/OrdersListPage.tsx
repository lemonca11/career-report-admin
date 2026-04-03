import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Select, Space, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import StatusTag from '@/components/StatusTag';
import { useOrderStore } from '@/store';
import type { Order } from '@/types/order';

const OrdersListPage = () => {
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);
  const retryGenerate = useOrderStore((state) => state.retryGenerate);

  const [keyword, setKeyword] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('全部');
  const [paymentFilter, setPaymentFilter] = React.useState<string>('全部');

  const filteredData = orders.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.orderNo.includes(keyword) ||
      item.userName.includes(keyword) ||
      item.agentName.includes(keyword);
    const matchesStatus = statusFilter === '全部' || item.status === statusFilter;
    const matchesPayment = paymentFilter === '全部' || item.paymentStatus === paymentFilter;
    return matchesKeyword && matchesStatus && matchesPayment;
  });

  const handleRetry = (record: Order) => {
    retryGenerate(record.id);
    message.success(`已重新触发订单 ${record.orderNo} 生成任务`);
  };



  const columns: TableColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150,
      sorter: (a, b) => a.orderNo.localeCompare(b.orderNo),
    },
    {
      title: '用户',
      dataIndex: 'userName',
      width: 110,
    },
    {
      title: '代理',
      dataIndex: 'agentName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      width: 180,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => `¥${value}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 120,
      filters: ['待生成', '生成中', '已完成', '生成失败', '异常'].map((value) => ({ text: value, value })),
      onFilter: (value, record) => record.status === value,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 120,
      filters: ['已支付', '待支付', '已退款'].map((value) => ({ text: value, value })),
      onFilter: (value, record) => record.paymentStatus === value,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '操作',
      key: 'action',
      width: 320,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap size="small">
          <Button size="small" type="link" onClick={() => navigate(`/orders/${record.id}`)}>
            详情
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<DownloadOutlined />}
            disabled={record.status !== '已完成'}
            onClick={() => {
              if (record.status === '已完成') {
                const reportUrl = `/api/reports/${record.reportId || record.id}/download`;
                window.open(reportUrl, '_blank');
                message.success('开始下载报告');
              }
            }}
          >
            下载报告
          </Button>
          <Button size="small" icon={<ReloadOutlined />} onClick={() => handleRetry(record)}>
            重试生成
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageTitle title="订单中心" subtitle="支持搜索、筛选和异常处理，覆盖订单全生命周期。" />
      <Card className="section-card">
        <div className="table-toolbar">
          <Input.Search
            allowClear
            placeholder="搜索订单号 / 用户 / 代理"
            style={{ width: 280 }}
            onSearch={setKeyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            style={{ width: 160 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['全部', '待生成', '生成中', '已完成', '生成失败', '异常'].map((value) => ({
              label: value,
              value,
            }))}
          />
          <Select
            style={{ width: 160 }}
            value={paymentFilter}
            onChange={setPaymentFilter}
            options={['全部', '已支付', '待支付', '已退款'].map((value) => ({ label: value, value }))}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1500 }}
        />
      </Card>
    </div>
  );
};

export default OrdersListPage;
