import React, { Component}  from 'react';
import socketIOClient from 'socket.io-client';
 
import axios from 'axios';
 
 
import './style.css';

class Chat extends React.Component    {
constructor(props){
    super(props);
}

state = {
    nick: '',
    messages: [],
    socket: socketIOClient(),
    activeUsers: [],
}

initialState(){
    const nick = localStorage.getItem('nick');
    console.log(nick);
    this.setState({nick:nick});
}

componentDidMount() {
    this.initialState();
    this.state.socket.emit('userList','');
    this.state.socket.on('userList', (users) => {
        this.setState({activeUsers: users});
        console.log(this.state.activeUsers);
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


  logout =() => {
    this.state.socket.on('logout', (users) => {
        console.log('incoming users', users);
        this.setState({activeUsers: users});
        console.log('after logout',this.state.activeUsers);
    }); 
    axios.post('/logout').then(
        (res)=>{}
    );
    localStorage.removeItem('nick');
    this.setState({nick:''});
    this.state.socket.emit('logout',JSON.stringify({nick: this.state.nick}));
    window.history.back();
    
  }
 inputRef = (node) => {
     this.inp = node;
 }
 usersList = (node) => {
     this.list = node;
 }
 

    render() {
          
       
        return (
         ( this.state.nick &&
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
               <button onClick = {this.send } >Send Message</button>
            <ul ref={this.usersList}>
              {this.renderUsers()}
            </ul>
        <button onClick={this.logout}>logout</button>
        
        </div>
        </div>)
           )
    }

}



export default   Chat;

  