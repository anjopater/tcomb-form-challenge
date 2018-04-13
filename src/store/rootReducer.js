import { combineReducers } from 'redux';
import { rootReducer as categories } from './categories';

const rootReducer = combineReducers({
  categories
});

export default rootReducer;
