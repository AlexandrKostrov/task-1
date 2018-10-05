import React, { Component}  from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import './style.css';

class Chat extends React.Component    {
constructor(props){
    super(props);
}

state = {
    users: [],
    messages: [],
    socket: socketIOClient(),
}

componentDidMount() {
    // const socket = socketIOClient() 
    // socket.on is another method that checks for incoming events from the server
    // This method is looking for the event 'change color'
    // socket.on takes a callback function for the first argument
    this.state.socket.on('message', (msg) => {
       const newMsgs = [...this.state.messages];
        newMsgs.push(msg);
         this.setState({users: msg.users});
        this.setState({messages: newMsgs});
    })
}

send =  (event) => {
    this.state.socket.emit('message', JSON.stringify({message:this.inp.value, nick:this.props.nick})); 
    this.inp.value = '';
  }

 

 handleRef = (node) => {
    this.div = node;
 }
 inputRef = (node) => {
     this.inp = node;
 }
  
 renderUsers () {
    return (this.state.users.map( (user, index) => {
        return (
            <li key = {index}>{user}</li>
        )
    }));
 }

    render() {
          
        
        return (
            
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
            <ul>
              {this.renderUsers()}
            </ul>

        </div>
           )
    }

}



export default Chat;

  