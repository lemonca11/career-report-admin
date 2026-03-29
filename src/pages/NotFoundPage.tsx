import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Result
        status="404"
        title="页面不存在"
        subTitle="请检查地址，或返回控制台继续操作。"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回控制台
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
