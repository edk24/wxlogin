import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Space, Popconfirm } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { getProjects, createProject, updateProject, deleteProject } from '../api/project';
import type { Project } from '../api/project';
import { integrationDoc } from '../docs/integration';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [docVisible, setDocVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  // 加载项目列表
  const loadProjects = async () => {
    setLoading(true);
    try {
      const res: any = await getProjects();
      setProjects(res.data || []);
    } catch (error) {
      message.error('加载项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 打开新建/编辑弹窗
  const handleOpenModal = (project?: Project) => {
    setEditingProject(project || null);
    if (project) {
      form.setFieldsValue(project);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProject) {
        await updateProject(editingProject.id!, values);
        message.success('更新成功');
      } else {
        await createProject(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadProjects();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 删除项目
  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      message.success('删除成功');
      loadProjects();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 切换项目状态
  const handleStatusChange = async (id: number, status: number) => {
    try {
      await updateProject(id, { status } as any);
      message.success('状态更新成功');
      loadProjects();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '项目标识', dataIndex: 'app_id', key: 'app_id' },
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '回调地址', dataIndex: 'redirect_uri', key: 'redirect_uri', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: Project) => (
        <Switch
          checked={status === 1}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={(checked) => handleStatusChange(record.id!, checked ? 1 : 0)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Project) => (
        <Space>
          <Button type="link" onClick={() => handleOpenModal(record)}>编辑</Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Button type="primary" onClick={() => handleOpenModal()}>新建项目</Button>
        <Button icon={<FileTextOutlined />} onClick={() => setDocVisible(true)}>对接文档</Button>
      </div>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="项目标识" name="app_id" rules={[{ required: true }]}>
            <Input placeholder="唯一标识，如: project1" />
          </Form.Item>
          <Form.Item label="项目名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="项目名称" />
          </Form.Item>
          <Form.Item label="回调地址" name="redirect_uri" rules={[{ required: true }]}>
            <Input placeholder="https://example.com/callback" />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="对接文档"
        open={docVisible}
        onCancel={() => setDocVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <div style={{
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
          padding: '16px 0'
        }}>
          <ReactMarkdown
            components={{
              code: ({ node, inline, className, children, ...props }: any) => (
                inline ?
                  <code style={{
                    background: '#f5f5f5',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 13
                  }} {...props}>{children}</code> :
                  <pre style={{
                    background: '#f5f5f5',
                    padding: 16,
                    borderRadius: 8,
                    overflow: 'auto'
                  }}>
                    <code {...props}>{children}</code>
                  </pre>
              ),
              h1: ({ children }) => <h1 style={{ borderBottom: '2px solid #e8e8e8', paddingBottom: 8 }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ marginTop: 24, color: '#262626' }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ marginTop: 16, color: '#595959' }}>{children}</h3>,
            }}
          >
            {integrationDoc}
          </ReactMarkdown>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectList;
