import React, { Component}  from 'react';
import Chat from '../chat/Chat';
import axios from 'axios'
import './style.css';



class Form extends React.Component {
state = {
  chat: false,
  nick: '',
}
onSubmit = event => {
   event.preventDefault();
   const data = {
    nick: event.target.nick.value,
    email: event.target.email.value,
    password: event.target.password.value
   }

   axios.post('/', data).then(res => {console.log(res);
     this.setState({nick: res.data.nick});
     
  });
  
   this.setState({chat : true})
}

    render()
    {return (
      <div>
        {!this.state.chat && 
        (<div className="formCont"> 
        <form onSubmit={this.onSubmit}>
        <div class="form-group">
          <label for="exampleInputEmail1">Nick</label>
          <input type="text" class="form-control" id="exampleInputEmail1" name="nick" aria-describedby="emailHelp" placeholder="Enter nick"/>
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" placeholder="Enter email"/>
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" name="password" placeholder="Password"/>
        </div>
        
        <button type="submit" class="btn btn-primary">Start Chating</button>
      </form>
      </div>)}
    {this.state.chat && <Chat nick={this.state.nick}/>} 
       </div>
    )}
}

export default Form;