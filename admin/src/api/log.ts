import request from './request';

export interface AuthLog {
  id?: number;
  project_id: number;
  user_id: number;
  auth_type: string;
  ip?: string;
  user_agent?: string;
  created_at?: string;
}

export const getLogs = (params?: {
  page?: number;
  pageSize?: number;
  projectId?: number;
  userId?: number;
}) => {
  return request.get('/admin/logs', { params });
};

export const getStats = () => {
  return request.get('/admin/logs/stats');
};
