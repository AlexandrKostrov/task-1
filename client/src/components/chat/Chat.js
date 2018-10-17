import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import UserList from '../userList/UserList';
import {
  initialState,
  initUser,
  message,
  userLogout,
  ban,
  unban,
  requestUserList,
  responseUserList,
  requestGetAllUsers,
  responseGetAllUsers,
  mute,
  unmute,
  recivingMessage,
} from '../../sockets/actions';
import { sendMessage, renderUsers } from '../../functions/index';
import axios from 'axios';

import './style.css';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    this.state = {
      token: token,
      socket: socketIOClient(`http://localhost:3001?token=${token}`),
      messages: [],
      activeUsers: [],
      allUsers: [],
    };
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  componentDidMount() {
    initialState(this.state.socket);
    requestUserList(this.state.socket);
    initUser(this.state.socket, this);
    ban(this.state.socket, this);
    unban(this.state.socket, this);
    responseUserList(this.state.socket, this);
    responseGetAllUsers(this.state.socket, this);
    mute(this.state.socket, this);
    unmute(this.state.socket, this);
    recivingMessage(this.state.socket, this);
  }

  logout = () => {
    axios.post('/logout');
    localStorage.removeItem('token');
    this.state.socket.emit('logout');
    this.state.socket.on('test', res => {
      console.log('THE RESPONSE IS', res);
      this.state.socket.emit('userList');
      window.history.back();
      this.state.socket.disconnect();
    });
  };

  inputRef = node => {
    this.inp = node;
  };

  usersList = node => {
    this.list = node;
  };

  render() {
    return this.state.ban ? (
      <div className="banned">YOU ARE BANNED</div>
    ) : (
      this.state.token && (
        <div className="container main">
          <div className="container lists" ref={this.handleRef}>
            <ul className="showMsgs">
              {this.state.messages.map((msg, index) => {
                return (
                  <li key={index} style={msg.color}>
                    {msg.nick + ' ' + msg.message}
                  </li>
                );
              })}
            </ul>

            <ul ref={this.usersList}>{renderUsers(this)}</ul>
          </div>
          <div className="container inpBtn">
            <input type="text" ref={this.inputRef} />
            <div>
              <button
                onClick={sendMessage(message, this)}
                disabled={this.state.muted ? true : false}
              >
                Send Message
              </button>
            </div>
            <div>
              <button onClick={this.logout} className="logout">
                logout
              </button>
            </div>
          </div>
          {this.state.admin && (
            <div>
              <button onClick={requestGetAllUsers(this.state.socket)}>List of all users</button>
              <UserList allUsers={this.state.allUsers} socket={this.state.socket} />
            </div>
          )}
        </div>
      )
    );
  }
}

export default Chat;
