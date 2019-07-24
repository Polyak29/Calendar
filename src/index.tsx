import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";
import { Provider } from 'react-redux';
import { createReducer } from './reducers';
import { createStore, compose, applyMiddleware } from "redux";
import Api from "./api";
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';

let apiApp = new Api();
const sagaMiddleware = createSagaMiddleware();
const initialState = {};
const store = createStore(createReducer(), initialState, compose(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(sagas, apiApp);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

