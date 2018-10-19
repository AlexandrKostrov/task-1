import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import UserList from '../userList/UserList';
// import {
//   initialState,
//   initUser,
//   message,
//   ban,
//   unban,
//   requestUserList,
//   responseUserList,
//   requestGetAllUsers,
//   responseGetAllUsers,
//   mute,
//   unmute,
//   recivingMessage,
//   disconnect,
// } from '../../sockets/actions';
import socketHoc from '../../sockets/actions';
import { sendMessage, renderUsers, logout } from '../../functions/index';
import chatHoc from './chatHoc';
import axios from 'axios';

import './style.css';

class Chat extends React.Component {
  render() {
    const token = localStorage.getItem('token');
    return this.props.banned ? (
      <div className="banned">YOU ARE BANNED</div>
    ) : (
      token && (
        <div className="container main">
          <div className="container lists" ref={this.props.handleListRef}>
            <ul className="showMsgs">
              {this.props.messages.map((msg, index) => {
                return (
                  <li key={index} style={msg.color}>
                    {msg.nick + ' ' + msg.message}
                  </li>
                );
              })}
            </ul>

            <ul ref={this.usersList}>{this.props.renderUsers()}</ul>
          </div>
          <div className="container inpBtn">
            <input type="text" ref={this.props.handleInputRef} />
            <div>
              <button onClick={this.props.sendMessage()} disabled={this.props.muted ? true : false}>
                Send Message
              </button>
            </div>
            <div>
              <button onClick={this.props.logout} className="logout">
                logout
              </button>
            </div>
          </div>
          {this.props.admin && (
            <div>
              <button onClick={this.props.requestGetAllUsers()}>List of all users</button>
              <UserList allUsers={this.props.allUsers} socket={this.props.socket} />
            </div>
          )}
        </div>
      )
    );
  }
}

export default socketHoc(chatHoc(Chat));
