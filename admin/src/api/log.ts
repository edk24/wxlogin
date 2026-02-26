import request from './request';

export interface AuthLog {
  id?: number;
  project_id: number;
  openid: string;
  scope: string;
  ip?: string;
  user_agent?: string;
  created_at?: string;
  project?: {
    id: number;
    app_id: string;
    name: string;
  };
  user?: {
    id: number;
    openid: string;
    nickname?: string;
    avatar?: string;
  };
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
