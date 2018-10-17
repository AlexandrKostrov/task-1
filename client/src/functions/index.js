import React from 'react';

export const sendMessage = function(callback, actUser) {
  return function() {
    if (Date.now() - actUser.state.lastMessage < 15000) {
      return;
    }
    callback(actUser.state.socket, actUser);
    actUser.inp.value = '';
    actUser.setState({ lastMessage: Date.now() });
  };
};

export const renderUsers = function(actUser) {
  return actUser.state.activeUsers.map((user, index) => {
    return (
      <li key={index} style={{ color: user.color }}>
        {user.nick}
      </li>
    );
  });
};
