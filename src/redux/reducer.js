import { combineReducers } from 'redux';
import { REGISTER, LOGIN, MESSAGE } from './actions';

function reducer(state = {}, action) {
	switch (action.type) {
		case REGISTER:
		case LOGIN:
			const numUnreads = countUnreads(action.payload.contacts);
			return { ...state, ...action.payload, numUnreads };
		case MESSAGE: // TODO: handle messages to non-contacts 
			const { contacts } = state;
			for (let i = 0; i < contacts.length; i++) {
				if (contacts[i].username !== action.payload.to) continue;
				contacts[i].pastMessages.push(action.payload.message);
				break;
			}
			return { ...state, contacts };
		default: return state;
	}
}

function countUnreads(contacts) {
	if (contacts.length === 0) return 0;
	let numUnreads = 0;
	for (let i = 0; i < contacts.length; i++) {
		if (contacts[i].hasUnread) numUnreads++;
	}
	return numUnreads;
}

export default combineReducers({ data: reducer });