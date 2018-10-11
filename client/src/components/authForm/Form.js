import React, { Component}  from 'react';
import Chat from '../chat/Chat';
import logoutHoc from './logoutHoc';
 
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios'
import './style.css';



class Form extends React.Component {


 
  onSubmit = event => {
    console.log(this.props)
     event.preventDefault();
     const data = {
      nick: event.target.nick.value,
      email: event.target.email.value,
      password: event.target.password.value
     }
     axios.post('/chat', data).then(res => {console.log(res);
      localStorage.setItem('token', res.data.token);
     
      //res.data.admin && localStorage.setItem('admin', res.data.admin);
   }).then(()=>this.props.history.push(`/chat`)); 
  }



 
logout = () => {
  window.history.pushState("", "", "/");
    axios.post('/logout');
    console.log(this.state.chat)
    this.setState({chat: false});
    console.log(this.state.chat);
  }

    render() {
   
      return (
      <div>
         
        (<div className="formCont"> 
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Nick</label>
          <input type="text" className="form-control"   name="nick" aria-describedby="emailHelp" placeholder="Enter nick"/>
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" className="form-control"   name="email" aria-describedby="emailHelp" placeholder="Enter email"/>
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control"  name="password" placeholder="Password"/>
        </div>
        
        <button type="submit" className="btn btn-primary">Start Chating</button>
       
       
      </form>
      </div> 
       </div>
    )}
}

 
 export default  Form ;