import { fork } from 'redux-saga/effects';
import { rootSaga as categories } from './categories';

export default function* rootSaga() {
  yield [fork(categories)];
}
