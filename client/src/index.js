import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './components/reducers';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import sagas from './components/sagas';
import createSagaMiddleware from 'redux-saga';
// import loginMiddleware from './middleWares/loginMiddleware';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
