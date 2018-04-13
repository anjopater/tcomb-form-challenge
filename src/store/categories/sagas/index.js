import { takeLatest } from 'redux-saga/effects';

import at from '../actions/types';
import fetch from './fetch';
import update from './update';
import remove from './remove';

export default function* root() {
  yield takeLatest(at.FETCH_REQUEST, fetch);
  yield takeLatest(at.UPDATE_REQUEST, update);
  yield takeLatest(at.REMOVE_ATTRIBUTE_REQUEST, remove);
}
