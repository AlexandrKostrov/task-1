import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './components/reducers';
import { Provider } from 'react-redux';
import loginMiddleware from './middleWares/loginMiddleware';

const store = createStore(rootReducer, applyMiddleware(loginMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
