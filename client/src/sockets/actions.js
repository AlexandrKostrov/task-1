import socketIOClient from 'socket.io-client';

const token = localStorage.getItem('token');
//const socket = socketIOClient(`http://localhost:3001?token=${token}`),

export const initialState = socket => {
  if (token) {
    socket.emit('initUser');
  }
  console.log(token);
};

export const userLogout = function(socket) {
  socket.emit('logout');
};

export const requestUserList = function(socket) {
  socket.emit('userList');
};

export const requestGetAllUsers = function(socket) {
  return function() {
    socket.emit('getAllUsers');
  };
};

export const message = function(socket, actUser) {
  socket.emit(
    'message',
    JSON.stringify({
      message: actUser.inp.value,
      nick: actUser.state.nick,
      lastMessage: actUser.state.lastMessage,
      forceHim: actUser.state.wasunmuted === 7 ? true : false,
    })
  );
};

export const recivingMessage = function(socket, actUser) {
  socket.on('message', msg => {
    console.log('INCOMMING MESSAGE', msg);
    const newMsgs = [...actUser.state.messages];
    newMsgs.push(msg);
    actUser.setState({ messages: newMsgs });
  });
};

export const mute = function(socket, actUser) {
  socket.on('mute', res => {
    if (actUser.state.id == res.id) {
      actUser.setState({ muted: true });
    }
  });
};

export const unmute = function(socket, actUser) {
  socket.on('unmute', res => {
    if (actUser.state.id == res.id) {
      actUser.setState({ muted: false, wasunmuted: res.wasUnmuted });
    }
  });
};

export const responseGetAllUsers = function(socket, actUser) {
  socket.on('getAllUsers', users => {
    actUser.setState({ allUsers: users });
    console.log('ALL USERS', actUser.state.allUsers);
  });
};

export const responseUserList = function(socket, actUser) {
  socket.on('userList', users => {
    actUser.setState({ activeUsers: users });
    console.log('ACTIVE USERS', actUser.state.activeUsers);
  });
};

export const initUser = function(socket, actUser) {
  socket.on('initUser', user => {
    actUser.setState({
      nick: user.nick,
      admin: user.admin,
      id: user.id,
      muted: user.muted,
      ban: user.banned,
      color: { color: user.color },
    });
    console.log('AutorizedUser', user);
  });
};

export const ban = function(socket, actUser) {
  socket.on('ban', res => {
    if (actUser.state.id == res.id) {
      socket.disconnect();
      actUser.setState({ ban: true });
    }
  });
};

export const unban = function(socket, actUser) {
  socket.on('unban', res => {
    if (actUser.state.id == res.id) {
      actUser.setState({ ban: false });
    }
  });
};
