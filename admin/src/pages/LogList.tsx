import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col, message } from 'antd';
import { getLogs, getStats } from '../api/log';
import type { AuthLog } from '../api/log';

const LogList: React.FC = () => {
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res: any = await getLogs({ page, pageSize });
      setLogs(res.data || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('加载日志失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res: any = await getStats();
      setStats(res);
    } catch (error) {
      console.error('加载统计失败');
    }
  };

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [page, pageSize]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: '项目标识',
      dataIndex: ['project', 'app_id'],
      key: 'project_app_id',
      render: (_: any, record: AuthLog) => record.project?.app_id || '-'
    },
    {
      title: '用户信息',
      key: 'user_info',
      render: (_: any, record: AuthLog) => {
        if (record.user?.nickname) {
          return `${record.user.nickname} (${record.openid})`;
        }
        return record.openid;
      }
    },
    { title: '授权类型', dataIndex: 'scope', key: 'scope' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: 'User Agent', dataIndex: 'user_agent', key: 'user_agent', ellipsis: true },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic title="总授权次数" value={stats.total} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="今日授权次数" value={stats.today} />
          </Card>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={logs}
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

export default LogList;
