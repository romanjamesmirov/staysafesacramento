import { combineReducers } from 'redux';
import { REGISTER, LOGIN } from './actions';

function reducer(state = {}, action) {
	switch (action.type) {
		case REGISTER:
		case LOGIN:
			const numUnreads = countUnreads(action.payload.contacts);
			return { ...state, ...action.payload, numUnreads };
		default: return state;
	}
}

function countUnreads(contacts) {
	let numUnreads = 0;
	for (let i = 0; i < contacts.length; i++) {
		if (contacts[i].hasUnread) numUnreads++;
	}
	return numUnreads;
}

export default combineReducers({ data: reducer });