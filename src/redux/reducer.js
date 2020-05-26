import { combineReducers } from 'redux';
import { REGISTER, LOGIN, MESSAGE, GET_ALL_USERS, GET_CONTACTS, GET_CHAT } from './actions';

function reducer(state = {}, action) {
	switch (action.type) {
		case REGISTER:
		case LOGIN: {
			const { payload } = action;
			const { allUsers, contacts } = evaluateUserGroups(payload, state);
			const bellIconNum = countUnread(payload.contacts);
			return { ...state, ...payload, contacts, bellIconNum, allUsers };
		} case MESSAGE: { // TODO: handle messages to non-contacts 
			const { contacts } = state;
			for (let i = 0; i < contacts.length; i++) {
				if (contacts[i].username !== action.payload.to) continue;
				contacts[i].pastMessages.push(action.payload.message);
				break;
			}
			return { ...state, contacts };
		} case GET_ALL_USERS: {
			const { allUsers, contacts } = evaluateUserGroups(action.payload, state);
			return { ...state, allUsers, contacts };
		} case GET_CONTACTS:
			return { ...state, contacts: action.payload };
		case GET_CHAT:
			const { username, contacts } = state;
			const contactIndex = action.payload.users[0] === username ? 1 : 0;
			const contactUsername = action.payload.users[contactIndex];
			for (let i = 0; i < contacts.length; i++) {
				if (contacts[i].username !== contactUsername) continue;
				contacts[i].pastMessages = action.payload.pastMessages;
				contacts[i].chatUsers = action.payload.users;
				break;
			}
			return { ...state, contacts };
		default: return state;
	}
}

function evaluateUserGroups(payload, state) {
	const username = payload.username || state.username;
	const contacts = payload.contacts || state.contacts;
	const allUsers = state.allUsers || payload.allUsers;
	if (!allUsers || !contacts) return { allUsers, contacts };
	const currentUserIndex = findUserIndexByUsername(allUsers, username);
	allUsers.splice(currentUserIndex, 1);
	return newUserGroupsObj(allUsers, contacts);
}

function newUserGroupsObj(allUsers, contacts) {
	if (contacts.length === 0) return { allUsers, contacts: [] };
	const oldcontact = contacts.splice(-1, 1);
	const prevObj = newUserGroupsObj(allUsers, contacts);
	const { username, hasUnread } = oldcontact;
	const contactIndex = findUserIndexByUsername(allUsers, username);
	const contact = allUsers.splice(contactIndex);
	contact.hasUnread = hasUnread;
	return { allUsers, contacts: prevObj.contacts.concat(contact) };
}

function findUserIndexByUsername(users, username) {
	if (users.length === 0) return -1;
	if (users[users.length - 1].username === username) return users.length - 1;
	return findUserIndexByUsername(users.slice(0, -1), username);
}

function countUnread(contacts) {
	if (contacts.length === 0) return 0;
	return (contacts[0].hasUnread ? 1 : 0) + countUnread(contacts.slice(1));
}

export default combineReducers({ data: reducer });