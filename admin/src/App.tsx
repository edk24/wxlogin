import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import ProjectList from './pages/ProjectList';
import UserList from './pages/UserList';
import LogList from './pages/LogList';
import Login from './pages/Login';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#000',
          padding: '0 24px',
          height: 56,
          lineHeight: '56px'
        }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>微信授权统一平台</div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: '#fff' }}
          >
            退出
          </Button>
        </Header>
        <Layout style={{ background: '#f5f5f5' }}>
          <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ borderRight: 0, paddingTop: 16 }}
            >
              <Menu.Item key="1">
                <Link to="/" style={{ textDecoration: 'none' }}>项目管理</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/users" style={{ textDecoration: 'none' }}>用户列表</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/logs" style={{ textDecoration: 'none' }}>授权日志</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: 24, background: '#f5f5f5' }}>
            <Content style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              minHeight: 'calc(100vh - 112px)'
            }}>
              <Routes>
                <Route path="/" element={<ProjectList />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/logs" element={<LogList />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;

