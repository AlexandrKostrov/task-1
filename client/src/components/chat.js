import React, { Component}  from 'react';
import axios from 'axios';

class Chat extends React.Component    {
constructor(props){
    super(props);
}

state = {
    users: [{
        nick:12345
    }],
}

 handleRef = (node) => {
    this.div = node;
 }

 getUsers = async () => {     
        const users = await axios.get(`/chat`)
        .then(r => r.data);
        console.log(users);
        this.setState({users});
    }
    render() {
        return (
            <div className = "container" ref = {this.handleRef}>
            
            <div className="jumbotron">
            <h1 className="dispaly-4">Start Chatting</h1>
            <input id="txtName" className="form-control" placeholder="Name" type="text"></input>
            <textarea id="txtMessage" className="form-control" placeholder="Message"></textarea>
            <button id="send" className="btn btn-success">Send</button>
            <div id="messages"></div>
            </div>


            {/* using this siple to check db connection */}
            {/* <ul>
            {
                this.state.users.map(user => {
                    return (
                     <li>{user.nick}</li>
                    )
                })
            }
           </ul>
                <input type="text" value="Sasha"/>
               <button class="btn-success" onClick = {this.getUsers}>Send</button> */}
            </div>
           )
    }

}



    export default Chat;

  