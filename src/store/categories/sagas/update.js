import { call, put } from 'redux-saga/effects';
import at from '../actions/types';

export default function* update({data}) {
  try {
    yield put({ type: at.UPDATE_SUCCESS, attribute: data });
  } catch (error) {
    yield put({ type: at.UPDATE_FAILURE });
  }
}
