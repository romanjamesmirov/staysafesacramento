import { combineReducers } from 'redux';
import { AUTH_REGISTER, AUTH_LOGIN, FETCH_ALL_USERS } from './types';

const initialState = {
	name: '',
	username: '',
	have: [],
	need: [],
	connections: [],
	token: '',
	allUsers: []
};

function reducer(state = initialState, action) {
	switch (action.type) {
		case AUTH_REGISTER:
		case AUTH_LOGIN:
			const { allUsers } = state;
			const { connections, username } = action.payload;
			if (allUsers.length === 0) return { ...state, ...action.payload };
			const withoutDupes = withoutUsers(allUsers, [...connections, username]);
			return { ...state, ...action.payload, allUsers: withoutUsers };
		case FETCH_ALL_USERS:
			const allUsers = action.payload;
			const { connections, username } = state;
			if (connections.length === 0) return { ...state, allUsers };
			const withoutDupes = withoutUsers(allUsers, [...connections, username]);
			return { ...state, allUsers: withoutUsers };
		default:
			return state;
	}
}

// Return allUsers array without current user and their connections.
function withoutUsers(allUsers, usernames) {
	if (usernames.length === 0) return allUsers;
	const slice = withoutUsers(allUsers, usernames.slice(1));
	const username = usernames[0].username || usernames[0];
	return withoutUsers(withoutUser(allUsers, username), slice);
}

// Return allUsers array without a user with a given username. 
function withoutUser(allUsers, username) {
	if (allUsers.length === 0) return [];
	const slice = withoutUser(allUsers.slice(0, -1), username);
	const lastOne = allUsers[allUsers.length - 1];
	return lastOne.username === username ? slice : allUsers;
}

const combinedReducers = combineReducers({ data: reducer });
export default combinedReducers;

// RESOURCES
// #R1 – medium.com/hackernoon/4aea9d56f5bd To be honest, this is as great as the other top results for "react redux in x minutes". Freecodecamp had a couple on "React Redux in 10 minutes" and FCC is great as always...
// #R2 – github.com/bradtraversy/redux_crash_course/blob/master/src – ...But bradtraversy's starter from his video on Redux with React which I watched a while ago is the best thing out there to get going. But even better is the knowledge of how beautifully simple Redux is. State is read-only. Actions are your setState. So what do actions do if not change state? They make a reducer return a new state based on the current state and the action.payload. So the app isn't based on state. It's based on reducers. Boom. 