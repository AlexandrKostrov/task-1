import React, { Component}  from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import './style.css';

class Chat extends React.Component    {
constructor(props){
    super(props);
}

state = {
    users: [{
        nick:12345
    }],
    endpoint: "http://localhost::3001",
    color: 'white',
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
        this.setState({messages: newMsgs});
    })
}

send =  (event) => {
    // const socket = socketIOClient();
    
    // this emits an event to the socket (your server) with an argument of 'red'
    // you can make the argument any color you would like, or any kind of data you want to send.
    
    this.state.socket.emit('message', this.inp.value); 
    this.inp.value = '';
    //return false;
    // socket.emit('change color', 'red', 'yellow') | you can have multiple arguments
  }

  setColor = (color) => {
    this.setState({ color })
  }

 handleRef = (node) => {
    this.div = node;
 }
 inputRef = (node) => {
     this.inp = node;
 }

 getUsers = async () => {     
        const users = await axios.get(`/chat`)
        .then(r => r.data);
        console.log(users);
        this.setState({users});
        this.send();
    }
    render() {
         
        
        return (
            
        <div className="container clearfix" ref = {this.handleRef}> 
           <ul>
             {this.state.messages.map((msg,index) => {
                 return (
                     <li key={index}>{this.props.nick + " " +msg}</li>
                 )
             })}
           </ul>
            
               <input type="text" ref={this.inputRef} />
               <button onClick = {this.send }>Send Message</button>
           
        </div>
           )
    }

}



export default Chat;

  