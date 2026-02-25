import React, { useState, useEffect } from 'react';
import { Table, Input, message, Space } from 'antd';
import { getUsers } from '../api/user';
import type { User } from '../api/user';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res: any = await getUsers({ page, pageSize, keyword });
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, pageSize, keyword]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'OpenID', dataIndex: 'openid', key: 'openid', ellipsis: true },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => avatar ? <img src={avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> : '-',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (sex: number) => sex === 1 ? '男' : sex === 2 ? '女' : '未知',
    },
    { title: '省份', dataIndex: 'province', key: 'province' },
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '首次授权', dataIndex: 'first_auth_time', key: 'first_auth_time' },
    { title: '最后授权', dataIndex: 'last_auth_time', key: 'last_auth_time' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索昵称或OpenID"
          onSearch={setKeyword}
          style={{ width: 300 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps || 10);
          },
        }}
      />
    </div>
  );
};

export default UserList;
