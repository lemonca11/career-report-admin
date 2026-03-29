import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';

import App from '@/App';
import '@/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#0d9488',
          colorBgLayout: '#f4efe7',
          colorBgContainer: '#fffcf8',
          colorText: '#1f2937',
          borderRadius: 18,
          fontFamily: '"SF Pro Display", "PingFang SC", "Hiragino Sans GB", sans-serif',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
