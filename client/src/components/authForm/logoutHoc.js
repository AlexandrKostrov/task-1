import React from 'react';
import axios from 'axios';

export default function logoutHoc (Component) {
    return class extends React.Component {

   

 
         
  render() {
      return <Component {...this.props} logout={this.logout}/>
  }
    }
}