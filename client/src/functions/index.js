import React from 'react';
import { logOut, disc, requestUserList } from '../sockets/actions';
import { sessionDestroy } from '../api/login';

// export const sendMessage = function(callback, actUser) {
//   return function() {
//     if (Date.now() - actUser.state.lastMessage < 15000) {
//       return;
//     }
//     callback(actUser);
//     actUser.inp.value = '';
//     actUser.setState({ lastMessage: Date.now() });
//   };
// };

// export const renderUsers = function(actUser) {
//   return actUser.state.activeUsers.map((user, index) => {
//     return (
//       <li key={index} style={{ color: user.color }}>
//         {user.nick}
//       </li>
//     );
//   });
// };

// export const logout = function(actUser) {
//   return function() {
//     sessionDestroy();
//     localStorage.removeItem('token');
//     logOut();
//     disc(requestUserList);
//   };
// };
//  logout = () => {
//     sessionDestroy();
//     localStorage.removeItem('token');
//     logOut(this);
//     disc(this, requestUserList);
//   };
