import React, { Component}  from 'react';
import socketIOClient from 'socket.io-client';
import UserList from '../userList/UserList';
import axios from 'axios';
 
 
import './style.css';

class Chat extends React.Component    {
constructor(props){
    super(props);
    const token = localStorage.getItem('token');
    this.state = {token:token,socket: socketIOClient(),messages: [],activeUsers: [],allUsers: [],}
}

// state = {
//     nick: '',
//     messages: [],
//     socket: socketIOClient(),
//     activeUsers: [],
//     allUsers: [],
     
   
// }

initialState(){
    if(this.state.token)
    {this.state.socket.emit('initUser',this.state.token); }
    console.log(this.state.token);
}

componentWillMount() {

} 
componentDidMount() {
    this.initialState();
    this.state.socket.emit('userList','');
    this.state.socket.on('initUser', (user) => {
        if(this.state.token === user.token)
       { this.setState({nick: user.nick, admin: user.admin,mute: user.muted, ban: user.banned});}
        console.log("AutorizedUser", user);
    });
    this.state.socket.on('ban', user => {
        console.log('BANNED USER', user); 
        if(localStorage.getItem('token') == user.token) 
       { this.logout();}
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
  
    // socket.on is another method that checks for incoming events from the server
    // This method is looking for the event 'change color'
    // socket.on takes a callback function for the first argument
    this.state.socket.on('message', (msg) => {
       const newMsgs = [...this.state.messages];
        newMsgs.push(msg);
        // this.setState({users: msg.users});
        this.setState({messages: newMsgs});
    })
}

send =  (event) => {
    this.state.socket.emit('message', JSON.stringify({message:this.inp.value, nick:this.state.nick})); 
    this.inp.value = '';
  }

 renderUsers () {
    return this.state.activeUsers.map((user, index) => {
         return (
             <li key={index}>{user.nick}</li>
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
    // this.setState({nick:''});
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
  drawUsers() {
     
 }
 getUsers = () => {
    this.state.socket.emit('getAllUsers');
    if(this.state.allUsers.length) {
        return (
            <ul>
 {this.state.allUsers.map(user => {
             return(
         <li>{user}</li>
             )
         })}
            </ul>
        )
        
        return;
    }
    
 }

    render() {
          const mute = this.state.mute;
        console.log("Why? this.state.nick",this.state.nick)
        console.log("Why? n,this.state.mute",this.state.mute)
        console.log("Banned",this.state.ban)
        return (
            !this.state.ban &&   
           this.state.token &&
            <div>
         
            <div className="container clearfix" ref = {this.handleRef}> 
        
           <ul>
             {this.state.messages.map((msg,index) => {
                 return (
                     <li key={index}>{msg.nick + " " +msg.message}</li>
                 )
             })}
             
           </ul>
            
               <input type="text" ref={this.inputRef} />
              { !this.state.mute &&
              <div> 
               <button onClick={this.send}>Send Message</button> 
               </div>}
               
             
            <ul ref={this.usersList}>
              {this.renderUsers()}
            </ul>
        <button onClick={this.logout}>logout</button>
        
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



export default   Chat;

  