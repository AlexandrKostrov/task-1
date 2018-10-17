const users = (state = [], action) => {
  switch (action.type) {
    case 'ADD_USER':
      console.log(action.result);
      localStorage.setItem('token', action.result.data.token);
      action.history.push('/chat');
      return [...state, {}];

    default:
      return state;
  }
};

export default users;
