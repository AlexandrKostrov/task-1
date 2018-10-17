import login from '../../api/login';

export const addUser = (data, history) => ({
  type: 'USER',
  promise: login,
  data: data,
  history: history,
});
