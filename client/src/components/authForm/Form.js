import React, { Component } from 'react';
import FaceBut from '../facebookButton/FaceBut';
import { connect } from 'react-redux';
import axios from 'axios';
import { addUser } from '../actions';
import login from '../../api/login';
import './style.css';

class Form extends React.Component {
  state = {
    err: '',
    promiseErr: '',
    socials: false,
  };

  onSubmit = event => {
    console.log(this.props);
    event.preventDefault();
    const data = {
      nick: event.target.nick.value,
      email: event.target.email.value,
      password: event.target.password.value,
      socialNet: false,
      socials: this.state.socials,
    };
    this.props.dispatch(addUser(data, this.props.history));
  };
  // this.props.dispatch(addUser());
  render() {
    console.log(this.state.promiseErr);
    const history = this.props.history;
    return (
      <div>
        (
        <div className="formCont">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <p className="error">{this.state.err}</p>
              <label htmlFor="exampleInputEmail1">Nick</label>
              <input
                type="text"
                className="form-control"
                name="nick"
                aria-describedby="emailHelp"
                placeholder="Enter nick"
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Start Chating
            </button>
            <FaceBut history={history} />
          </form>
        </div>
      </div>
    );
  }
}

export default connect()(Form);
