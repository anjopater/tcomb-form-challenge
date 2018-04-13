import { call, put } from 'redux-saga/effects';
import at from '../actions/types';

export default function* fetch() {
  try {
    //get from local storage
    yield put({ type: at.FETCH_SUCCESS });
  } catch (error) {
    yield put({ type: at.FETCH_FAILURE });
  }
}
