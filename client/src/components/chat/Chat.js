import React, { Component}  from 'react';
import socketIOClient from 'socket.io-client';
import UserList from '../userList/UserList';
// import initialState from './initialState';
import axios from 'axios';
 
 
import './style.css';

class Chat extends React.Component    {
constructor(props){
    super(props);
    const token = localStorage.getItem('token');
    this.state = {token:token,socket: socketIOClient(),messages: [],activeUsers: [],allUsers: [],}
}

 

initialState(){
    if(this.state.token)
    {this.state.socket.emit('initUser',this.state.token); }
    console.log(this.state.token);
}

componentWillUnmount() {
    this.state.socket.disconnect(0);
} 
componentDidMount() {
    this.initialState();
    this.state.socket.emit('userList','');
    this.state.socket.on('initUser', (user) => {
        if(this.state.token === user.token)
       { 
        if(user.admin)   
       { this.setState({nick: user.nick, admin: user.admin, color: {color: user.color}});}
        else {
         this.setState({nick: user.nick, mute: user.muted, ban: user.banned, color: {color: user.color}});
        } 
    }
        console.log("AutorizedUser", user);
    });
    this.state.socket.on('ban', user => {
        console.log('BANNED USER', user); 
        if(localStorage.getItem('token') == user.token) 
       {this.logout();}
    })
    this.state.socket.on('userList', (users) => {
        this.setState({activeUsers: users});
        console.log(this.state.activeUsers);
    });
    this.state.socket.on('getAllUsers', (users)=>{
        this.setState({allUsers:users})
        console.log(this.state.allUsers);
    });
    this.state.socket.on('mute', (response) => {
        console.log(response);
        if(localStorage.getItem('token') == response.token) {
            this.setState({mute: response.muted});
            console.log('user mutted',this.state.mute);
        }
    });
    this.state.socket.on('msgSend', (response) => {
        console.log(response);
        if(localStorage.getItem('token') == response.token) {
            this.setState({sended: response.sended});
            console.log('user mutted',this.state.sended);
        }
    });
  
 
    this.state.socket.on('message', (msg) => {
       const newMsgs = [...this.state.messages];
        newMsgs.push(msg);
        this.setState({messages: newMsgs});
    })
}

send =  (event) => {
    this.state.socket.emit('message', JSON.stringify({message:this.inp.value, nick:this.state.nick, token:this.state.token})); 
    this.inp.value = '';
    if(!this.state.admin)
   { this.state.socket.emit('msgSend',this.state.token);
    setTimeout(() => {
        this.state.socket.emit('msgSend',this.state.token);
    },5000);}
  }

 renderUsers () {
    return this.state.activeUsers.map((user, index) => {
         return (
             <li key={index} style={{color: user.color}}>{user.nick}</li>
         )
     })
 }



  logout = () => {
    this.state.socket.on('logout', (users) => {
        console.log('incoming users', users);
        this.setState({activeUsers: users});
        console.log('after logout',this.state.activeUsers);
    }); 
    axios.post('/logout').then(
        (res)=>{}
    );
    localStorage.removeItem('token');
    this.state.socket.emit('logout',this.state.token);
    this.state.socket.emit('userList','');
    window.history.back();
    
  }
 inputRef = (node) => {
     this.inp = node;
 }
 usersList = (node) => {
     this.list = node;
 }

 getUsers = () => {
    this.state.socket.emit('getAllUsers');
 }

    render() {
          
        console.log("Why? this.state.nick",this.state.nick)
        console.log("Why? n,this.state.mute",this.state.mute)
        console.log("Banned",this.state.sended)
        return this.state.ban ? (<div className="banned">YOU ARE BANNED</div>):(
            this.state.token &&  
             
           
            <div className="container main">
            <div className="container lists" ref = {this.handleRef}> 
        
           <ul className="showMsgs">
             {this.state.messages.map((msg,index) => {
                 return (
                     <li key={index} style={msg.color}>{msg.nick + " " +msg.message}</li>
                 )
             })}
             
           </ul>

            <ul ref={this.usersList}>
              {this.renderUsers()}
            </ul>
            </div>
            <div className="container inpBtn">
            <input type="text" ref={this.inputRef} />
            { !this.state.mute &&
              <div> 
               <button onClick={this.send} className={this.state.sended? "disabled":"able"}>Send Message</button> 
               </div>}
               <div> 
        <button onClick={this.logout} className="logout">logout</button>
        </div>
        </div>
        {this.state.admin && 
        <div>
        <button onClick={this.getUsers}>List of all users</button> 
        <UserList allUsers={this.state.allUsers} socket={this.state.socket}/>
        </div>
        }
        </div> 
           )
    }

}



export default    Chat;

  