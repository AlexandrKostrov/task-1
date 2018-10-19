import { login } from '../../api/login';

export const addUser = (data, history) => ({
  type: 'USER',
  data: data,
  history: history,
});

export const activeUsers = (users) => ({
  type: 'ACTIVE_USERS',
  users: users,
});