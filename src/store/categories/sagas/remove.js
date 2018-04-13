import { call, put } from 'redux-saga/effects';
import at from '../actions/types';

export default function* remove({data}) {
  console.log(data);
  try {  
    yield put({ type: at.REMOVE_ATTRIBUTE_SUCCESS, data: data });
  } catch (error) {
    yield put({ type: at.REMOVE_ATTRIBUTE_FAILURE });
  }
}
