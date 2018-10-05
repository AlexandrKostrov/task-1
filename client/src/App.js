import React, { Component } from 'react';
 
import './App.css';
import Chat from './components/chat/chat';
import Form from './components/authForm/Form';

class App extends Component {
  render() {
    return (
      <div>
        <Form/>
        {/* <Chat/>  */}
      </div>
      
    );
  }
}

export default App;
