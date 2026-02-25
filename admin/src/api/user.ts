import request from './request';

export interface User {
  id?: number;
  openid: string;
  unionid?: string;
  nickname?: string;
  avatar?: string;
  sex?: number;
  province?: string;
  city?: string;
  country?: string;
  first_auth_time?: string;
  last_auth_time?: string;
  created_at?: string;
  updated_at?: string;
}

// 获取用户列表
export const getUsers = (params?: { page?: number; pageSize?: number; keyword?: string }) => {
  return request.get('/admin/users', { params });
};

// 获取单个用户
export const getUser = (id: number) => {
  return request.get(`/admin/users/${id}`);
};
