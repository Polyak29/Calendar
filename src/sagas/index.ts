import { all } from 'redux-saga/effects';
import app from './app';

export default function* rootSaga(extraArguments: any) {
  yield all([
    app(extraArguments),
  ]);
}