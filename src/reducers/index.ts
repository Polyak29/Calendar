import app from './app';
import {combineReducers} from "redux";

const reducers = {
  app,
};

export default () => combineReducers({...reducers});

export const createReducer = () => { return combineReducers({ ...reducers })};