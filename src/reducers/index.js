import { combineReducers } from 'redux';
import reducer from './reducer';

const combinedReducers = combineReducers({ data: reducer });

export default combinedReducers;