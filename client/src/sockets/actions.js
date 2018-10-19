import socketIOClient from 'socket.io-client';
import React from 'react';
import { sessionDestroy } from '../api/login';
import { connect } from 'react-redux';
import { activeUsers } from '../components/actions/index';

function socketHoc(Component) {
  return class extends React.Component {
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

    // ACTIONS FOR REDUCER:

    //  FUNCTIONS FOR SAGA:
    // activeUsersList = function () {
    //   const res;
    //   this.state.socket.emit('userList');
    //  this.state.socket.on('userList', users => {
    //     console.log('ACTIVE USERS', users);
    //     res = users;
    //   });
    //   return res;
    // }

    initialState = () => {
      if (this.state.token) {
        this.state.socket.emit('initUser');
      }
      console.log(this.state.token);
    };
    requestUserList = () => {
      this.state.socket.emit('userList');
    };
    requestGetAllUsers = () => {
      return () => {
        this.state.socket.emit('getAllUsers');
      };
    };

    handleListRef = node => (this.list = node);
    handleInputRef = node => (this.inp = node);

    message = () => {
      this.state.socket.emit(
        'message',
        JSON.stringify({
          message: this.inp.value,
          nick: this.state.nick,
          lastMessage: this.state.lastMessage,
          forceHim: this.state.wasunmuted === 7 ? true : false,
        })
      );
    };

    // logOut = () => {
    //   this.state.socket.emit('logout');
    // };

    recivingMessage = () => {
      this.state.socket.on('message', msg => {
        console.log('INCOMMING MESSAGE', msg);
        const newMsgs = [...this.state.messages];
        newMsgs.push(msg);
        this.setState({ messages: newMsgs });
      });
    };

    mute = () => {
      this.state.socket.on('mute', res => {
        if (this.state.id == res.id) {
          this.setState({ muted: true });
        }
      });
    };

    unmute = () => {
      this.state.socket.on('unmute', res => {
        if (this.state.id == res.id) {
          this.setState({ muted: false, wasunmuted: res.wasUnmuted });
        }
      });
    };

    responseGetAllUsers = () => {
      this.state.socket.on('getAllUsers', users => {
        this.setState({ allUsers: users });
        console.log('ALL USERS', this.state.allUsers);
      });
    };

    responseUserList = () => {
      this.state.socket.on('userList', users => {
        this.setState({ activeUsers: users });
        console.log('ACTIVE USERS', this.state.activeUsers);
      });
    };

    initUser = () => {
      this.state.socket.on('initUser', user => {
        this.setState({
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

    ban = actUser => {
      this.state.socket.on('ban', res => {
        if (this.state.id == res.id) {
          this.state.socket.disconnect();
          this.setState({ ban: true });
        }
      });
    };

    unban = actUser => {
      this.state.socket.on('unban', res => {
        if (this.state.id == res.id) {
          this.setState({ ban: false });
        }
      });
    };

    logout = () => {
      sessionDestroy();
      localStorage.removeItem('token');
      this.state.socket.emit('logout');
      this.disc(this.requestUserList);
    };

    disc = callback => {
      this.state.socket.on('test', res => {
        console.log('THE RESPONSE IS', res);
        callback(this.state.socket);
        window.history.back();
        this.state.socket.disconnect();
      });
    };
    // logout = () => {
    //   axios.post('/logout');
    //   localStorage.removeItem('token');
    //   this.state.socket.emit('logout');
    //   this.state.socket.on('test', res => {
    //     console.log('THE RESPONSE IS', res);
    //     this.state.socket.emit('userList');
    //     window.history.back();
    //     this.state.socket.disconnect();
    //   });
    // };

    disconnect = () => {
      this.state.socket.disconnect();
    };

    sendMessage = () => {
      return () => {
        if (Date.now() - this.state.lastMessage < 15000) {
          return;
        }
        this.message();
        this.inp.value = '';
        this.setState({ lastMessage: Date.now() });
      };
    };

    renderUsers = () => {
      return this.state.activeUsers.map((user, index) => {
        return (
          <li key={index} style={{ color: user.color }}>
            {user.nick}
          </li>
        );
      });
    };
    render() {
      return (
        <Component
          {...this.props}
          disconnect={this.disconnect}
          unban={this.unban}
          ban={this.ban}
          banned={this.state.ban}
          muted={this.state.muted}
          initUser={this.initUser}
          responseUserList={this.responseUserList}
          responseGetAllUsers={this.responseGetAllUsers}
          unmute={this.unmute}
          mute={this.mute}
          recivingMessage={this.recivingMessage}
          logOut={this.logOut}
          disc={this.disc}
          message={this.message}
          requestGetAllUsers={this.requestGetAllUsers}
          requestUserList={this.requestUserList}
          initialState={this.initialState}
          token={this.state.token}
          socket={this.state.socket}
          logout={this.logout}
          handleListRef={this.handleListRef}
          handleInputRef={this.handleInputRef}
          sendMessage={this.sendMessage}
          messages={this.state.messages}
          activeUsers={this.state.activeUsers}
          renderUsers={this.renderUsers}
          admin={this.state.admin}
          allUsers={this.state.allUsers}
        />
      );
    }
  };
}

export default socketHoc;
