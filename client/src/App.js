import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Chat from './components/chat/Chat';
import Form from './components/authForm/Form';
 

class App extends Component {
  render() {
    return (
      <div>

      <Router>
      <Switch>
       
        
       <Route exact path='/' component={Form}/>  
       <Route exact path='/chat' component={Chat}/>   
        </Switch>
     
     </Router>
   
      </div>
      
    );
  }
}

export default App;
