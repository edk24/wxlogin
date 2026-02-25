import request from './request';

export interface Project {
  id?: number;
  app_id: string;
  name: string;
  redirect_uri: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

// 获取项目列表
export const getProjects = () => {
  return request.get('/admin/projects');
};

// 获取单个项目
export const getProject = (id: number) => {
  return request.get(`/admin/projects/${id}`);
};

// 创建项目
export const createProject = (data: Project) => {
  return request.post('/admin/projects', data);
};

// 更新项目
export const updateProject = (id: number, data: Project) => {
  return request.put(`/admin/projects/${id}`, data);
};

// 删除项目
export const deleteProject = (id: number) => {
  return request.delete(`/admin/projects/${id}`);
};
