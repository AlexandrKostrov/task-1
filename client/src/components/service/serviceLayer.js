import React from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

export default function serviceLayer(Component) {
    return class extends React.Component {
        constructor(props){
            super(props);
            const token = localStorage.getItem('token');
            this.state = {
                token:token,
                socket: socketIOClient(`http://localhost:3001?token=${token}`),
                messages: [],
                activeUsers: [],
                allUsers: [],
            }
        }
    
        initialState(){
            if(this.state.token){
                this.state.socket.emit('initUser'); 
            }
            console.log(this.state.token);
        }
    
        componentWillUnmount() {
            this.state.socket.disconnect(0);
        } 
    
        componentDidMount() {
            this.initialState();
            this.state.socket.emit('userList');
            this.state.socket.on('initUser', (user) => {
                
            this.setState({nick: user.nick, 
                admin: user.admin,
                id: user.id, 
                muted: user.muted, 
                ban: user.banned, 
                color: {color: user.color}});
            console.log("AutorizedUser", user);
            });
    
            this.state.socket.on('ban', res => {
                if(this.state.id == res.id){
                    this.state.socket.disconnect();
                    this.setState({ban: true});
                }
            });
    
            this.state.socket.on('unban', res => {
                if(this.state.id == res.id){
                    this.setState({ban: false});
                }
            })
    
            this.state.socket.on('userList', (users) => {
                this.setState({activeUsers: users});
                console.log("ACTIVE USERS",this.state.activeUsers);
            });
    
            this.state.socket.on('getAllUsers', (users)=>{
                this.setState({allUsers:users})
                console.log("ALL USERS",this.state.allUsers);
            });
    
            this.state.socket.on('mute', (res) => {
                if(this.state.id == res.id) {
                     this.setState({muted: true});
                }      
            });
    
            this.state.socket.on('unmute', (res) => {
                if(this.state.id == res.id) {
                     this.setState({muted: false});
                }      
                
            });
        
            this.state.socket.on('message', (msg) => {
                console.log("INCOMMING MESSAGE", msg);
                const newMsgs = [...this.state.messages];
                newMsgs.push(msg);
                this.setState({messages: newMsgs});
                this.setState({lastMessage: Date.now()});
            })
        }
    
        send =  () => {
            this.state.socket.emit('message', JSON.stringify({message:this.inp.value, nick:this.state.nick, lastMessage: this.state.lastMessage})); 
            this.inp.value = '';
        }
    
        renderUsers = ()=> {
            return this.state.activeUsers.map((user, index) => {
                return (
                    <li key={index} style={{color: user.color}}>{user.nick}</li>
                )
            })
        }
    
        logout = () => {
            axios.post('/logout');
            localStorage.removeItem('token');
            this.state.socket.emit('logout');
            this.state.socket.on('disconnect', (res) => {
                console.log("THE RESPONSE IS", res);
                this.state.socket.emit('userList');
                window.history.back();
                this.state.socket.disconnect();
            });
            
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
    
        render(){
            return (
                <Component 
                {...this.props} 
                ban={this.state.ban}
                token={this.state.token}
                handleRef={this.handleRef}
                messages={this.state.messages}
                usersList={this.usersList}
                renderUsers={this.renderUsers}
                inputRef={this.inputRef}
                send={this.send}
                logout={this.logout}
                admin={this.state.admin}
                getUsers={this.getUsers}
                allUsers={this.state.allUsers}
                socket={this.state.socket}/>
            )
        }
    }
}