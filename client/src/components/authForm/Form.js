import React, { Component}  from 'react';
import FaceBut from '../facebookButton/FaceBut';
import facebookHoc from './facebookHoc';
import axios from 'axios';
import './style.css';



class Form extends React.Component {
   
  state ={
     err:"", 
     promiseErr: "", 
     socials: false,
   }

 
  onSubmit = event => {
    console.log(this.props)
     event.preventDefault();
     const data = {
      nick: event.target.nick.value,
      email: event.target.email.value,
      password: event.target.password.value,
      socialNet: false,
      socials: this.state.socials,
     }
     axios.post('/chat', data).then(res => {console.log(res);
      if(res.data.token)
      {localStorage.setItem('token', res.data.token);}
      else {
         this.setState({err:res.data.msg}); 
         throw new Error(res.data.msg);
      }
   }).then(()=>this.props.history.push(`/chat`)).catch(err=> { 
   // this.setState({err:err.Error}); 
     console.log(err)
  }); 
  }


    render() {
   console.log(this.state.promiseErr);
   const history = this.props.history;
      return (
      <div>
         
        (<div className="formCont"> 
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <p className="error">{this.state.err}</p>
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
        <FaceBut history={history}/>
       
      </form>
      </div> 
       </div>
    )}
}

 
 export default   Form;