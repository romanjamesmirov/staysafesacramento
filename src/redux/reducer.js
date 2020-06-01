import { combineReducers } from 'redux';
import { REGISTER, LOGIN, ADD_CONTACT } from './actions';

function reducer(state = {}, action) {
	switch (action.type) {
		case REGISTER:
		case LOGIN:
			const numUnreads = countUnreads(action.payload.contacts);
			return { ...state, ...action.payload, numUnreads };
		case ADD_CONTACT:
			return { ...state, contacts: state.contacts.concat(action.payload) };
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