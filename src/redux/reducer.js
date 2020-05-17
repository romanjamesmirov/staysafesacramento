import { combineReducers } from 'redux';
import { REGISTER, LOGIN, GET_ALL_USERS, GET_CONTACTS, CHAT_LOADED, RECEIVE_CHAT, SEND_CHAT } from './actions';

function reducer(state = {}, action) {
	switch (action.type) {
		case REGISTER:
		case LOGIN:
			action.payload.bellIconNum = countUnread(action.payload.connections);
			const recalculated = newOrSameUserGroupsObj(action.payload, state);
			action.payload.connections = recalculated.connections;
			return { ...state, ...action.payload, allUsers: recalculated.allUsers };
		case GET_ALL_USERS: { // Curly braces because you can't redeclare vars. 
			const { allUsers, connections } = newOrSameUserGroupsObj(action.payload, state);
			return { ...state, allUsers, connections };
		} case CHAT_LOADED:
			/* add the chat to a connection in the connections array (pull from allUsers or /api/user if it's a new connection). */
			const { connections } = state;
			const connectionIndex = findUserIndexByUsername(connections, action.payload.recipientUsername);
			if (!connectionIndex) {
				return { ...state, connections: connections.concat(action.payload) };
			}
			connections[connectionIndex] = action.payload;
			return { ...state, connections };
		default: return state;
	}
}

function newOrSameUserGroupsObj(payload, state) {
	const username = payload.username || state.username;
	const connections = payload.connections || state.connections;
	const allUsers = state.allUsers || payload.allUsers;
	if (!allUsers || !connections) return { allUsers, connections };
	const currentUserIndex = findUserIndexByUsername(allUsers, username);
	allUsers.splice(currentUserIndex, 1);
	return newUserGroupsObj(allUsers, connections);
}

function newUserGroupsObj(allUsers, connections) {
	if (connections.length === 0) return { allUsers, connections: [] };
	const oldConnection = connections.splice(-1, 1);
	const prevObj = newUserGroupsObj(allUsers, connections);
	const { username, hasUnread } = oldConnection;
	const connectionIndex = findUserIndexByUsername(allUsers, username);
	const connection = allUsers.splice(connectionIndex);
	connection.hasUnread = hasUnread;
	return { allUsers, connections: prevObj.connections.concat(connection) };
}

function findUserIndexByUsername(users, username) {
	if (users.length === 0) return -1;
	if (users[users.length - 1].username === username) return users.length - 1;
	return findUserIndexByUsername(users.slice(0, -1), username);
}

function countUnread(connections) {
	if (connections.length === 0) return 0;
	return (connections[0].hasUnread ? 1 : 0) + countUnread(connections.slice(1));
}

export default combineReducers({ data: reducer });

// RESOURCES
// #R1 – medium.com/hackernoon/4aea9d56f5bd To be honest, this is as great as the other top results for "react redux in x minutes". Freecodecamp had a couple on "React Redux in 10 minutes" and FCC is great as always...
// #R2 – github.com/bradtraversy/redux_crash_course/blob/master/src – ...But bradtraversy's starter from his video on Redux with React which I watched a while ago is the best thing out there to get going. But even better is the knowledge of how beautifully simple Redux is. State is read-only. Actions are your setState. So what do actions do if not change state? They make a reducer return a new state based on the current state and the action.payload. So the app isn't based on state. It's based on reducers. Boom. 