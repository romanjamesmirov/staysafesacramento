import { combineReducers } from 'redux';
import { REGISTER, LOGIN, GET_ALL_USERS, CHAT_LOADED, RECEIVE_CHAT, SEND_CHAT } from './types';

function reducer(state = {}, action) {
	switch (action.type) {
		case REGISTER:
		case LOGIN:
			action.payload.bellIconNum = countUnread(action.payload.connections);
			const stateAllUsers = allUsersWithoutDupes(payload, state);
			if (!stateAllUsers) return { ...state, ...action.payload };
			return { ...state, ...action.payload, allUsers: stateAllUsers };
		case GET_ALL_USERS:
			const payloadAllUsers = allUsersWithoutDupes(payload, state);
			return { ...state, allUsers: payloadAllUsers };
		case CHAT_LOADED:
			/* OK, so here's the deal. I'm going to bed at 9 PM but I want you to know where I left off so you know what to pick up on. I have my connections array in redux. It's either undefined if the user isn't logged in or an array with zero or more usernames in there (if it's zero, it's not undefined as [] == true, remember?). OK so when I load a chat from socket.io, I want to add to the appropriate connection a property `history` with the chat history stored there. If the connection doesn't exist, move it from the allUsers array or call /api/user if !allUsers. And that's another thing. Don't just delete duplicates from the allUsers array in allUsersWithoutDupes(). You want to transfer the name, have, and need properties of those users to the connections array. By default, the connections array is just usernames. So to recap, two things to work on: allUsersWithoutDupes() should also return an updated connections array and case CHAT_LOADED should add the chat to a connection in the connections array (pull from allUsers or /api/user if it's a new connection). */
			const { connections } = state;
			const connectionIndex = getConnectionIndex(connections, action.payload.recipientUsername);
			if (!connectionIndex) {
				return { ...state, connections: connections.concat(action.payload) };
			}
			connections[connectionIndex] = action.payload;
			return { ...state, connections };
		default: return state;
	}
}

// Check if we need to call withoutUsers() and call if we do. 
function allUsersWithoutDupes(payload, state) {
	const username = payload.username || state.username;
	const connections = payload.connections || state.connections;
	const allUsers = state.allUsers || payload.allUsers;
	if (!allUsers || !username) return allUsers; 
	return withoutUsers(allUsers, [...connections, username]);
}

// Return allUsers array without the users with the given usernames. 
function withoutUsers(allUsers, usernames) {
	if (usernames.length === 0) return allUsers;
	const slice = withoutUsers(allUsers, usernames.slice(1));
	const username = usernames[0].username || usernames[0];
	return withoutUsers(withoutUser(allUsers, username), slice);
}

// Return allUsers array without the user with the given username.
function withoutUser(allUsers, username) {
	if (allUsers.length === 0) return [];
	const slice = withoutUser(allUsers.slice(0, -1), username);
	const lastOne = allUsers[allUsers.length - 1];
	return lastOne.username === username ? slice : allUsers;
}

// Add up and return the number of connections who have unread messages.
function countUnread(connections) {
	if (connections.length === 0) return 0;
	const slice = countUnread(connections.slice(1));
	return (connections[0].hasUnread ? 1 : 0) + slice;
}

function getConnectionIndex(connections, username) {
	if (connections.length === 0) return null;
	if (connections[connections.length - 1].username === username) return indexWhere(connections.slice(0, -1), username);
	return connections.length - 1;
}

const combinedReducers = combineReducers({ data: reducer });
export default combinedReducers;

// RESOURCES
// #R1 – medium.com/hackernoon/4aea9d56f5bd To be honest, this is as great as the other top results for "react redux in x minutes". Freecodecamp had a couple on "React Redux in 10 minutes" and FCC is great as always...
// #R2 – github.com/bradtraversy/redux_crash_course/blob/master/src – ...But bradtraversy's starter from his video on Redux with React which I watched a while ago is the best thing out there to get going. But even better is the knowledge of how beautifully simple Redux is. State is read-only. Actions are your setState. So what do actions do if not change state? They make a reducer return a new state based on the current state and the action.payload. So the app isn't based on state. It's based on reducers. Boom. 