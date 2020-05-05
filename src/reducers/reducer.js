import { AUTH_REGISTER, AUTH_LOGIN, FETCH_ALL_USERS } from '../actions/types';

const initialState = {
	name: '',
	username: '',
	have: [],
	need: [],
	connections: [],
	updates: [],
	token: '',
	allUsers: [],
	fetchedAllUsers: false
};

export default function (state = initialState, action) {
	switch (action.type) {
		case AUTH_REGISTER:
		case AUTH_LOGIN:
			return { ...state, ...action.payload };
		case FETCH_ALL_USERS:
			return { ...state, allUsers: action.payload, fetchedAllUsers: true };
		default:
			return state;
	}
}

// If you want to split up your reducer, see Brad Traversy's repo below.
// medium.com/hackernoon/4aea9d56f5bd To be honest, this is as great as the other top results for "react redux in x minutes". Freecodecamp had a couple on "React Redux in 10 minutes" and FCC is great as always...
// github.com/bradtraversy/redux_crash_course/blob/master/src ...But bradtraversy's starter from his video on Redux with React which I watched a while ago is the best thing out there to get going. But even better is the knowledge of how beautifully simple Redux is. State is read-only. Actions are your setState. So what do actions do if not change state? They make a reducer return a new state based on the current state and the action.payload. So the app isn't based on state. It's based on reducers. Boom. 