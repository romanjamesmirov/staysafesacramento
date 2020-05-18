import { combineReducers } from 'redux';
import { REGISTER, LOGIN, GET_ALL_USERS, GET_CONTACTS, GET_CHAT, POST_MESSAGE } from './actions';

function reducer(state = {}, action) {
	switch (action.type) {
		case REGISTER:
		case LOGIN:
			action.payload.bellIconNum = countUnread(action.payload.contacts);
			const recalculated = newOrSameUserGroupsObj(action.payload, state);
			action.payload.contacts = recalculated.contacts;
			return { ...state, ...action.payload, allUsers: recalculated.allUsers };
		case GET_ALL_USERS: { 
			const { allUsers, contacts } = newOrSameUserGroupsObj(action.payload, state);
			return { ...state, allUsers, contacts };
		} case GET_CONTACTS:
			return { ...state, contacts: action.payload };
		case GET_CHAT:
			// add the chat to a contact in the contacts array (pull from allUsers or /api/user if it's a new contact).
			const { contacts } = state;
			const contactIndex = findUserIndexByUsername(contacts, action.payload.to);
			contacts[contactIndex].pastMessages = action.payload.pastMessages;
			contacts[contactIndex].contactIsChatUserNumber = action.payload.contactIsChatUserNumber;
			return { ...state, contacts };
		case GET_MESSAGE:
			const { contacts } = state;
			
		default: return state;
	}
}

function newOrSameUserGroupsObj(payload, state) {
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

// RESOURCES
// #R1 – medium.com/hackernoon/4aea9d56f5bd To be honest, this is as great as the other top results for "react redux in x minutes". Freecodecamp had a couple on "React Redux in 10 minutes" and FCC is great as always...
// #R2 – github.com/bradtraversy/redux_crash_course/blob/master/src – ...But bradtraversy's starter from his video on Redux with React which I watched a while ago is the best thing out there to get going. But even better is the knowledge of how beautifully simple Redux is. State is read-only. Actions are your setState. So what do actions do if not change state? They make a reducer return a new state based on the current state and the action.payload. So the app isn't based on state. It's based on reducers. Boom. 