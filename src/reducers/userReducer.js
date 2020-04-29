import { REGISTER_USER, LOGIN_USER, GET_USERS } from '../actions/types';

export const initialState = {
	name: '',
	username: '',
	have: [],
	need: [],
	token: '',
	allUsers: [],
	loadedAllUsers: false
};

export default function (state = initialState, action) {
	switch (action.type) {
		case REGISTER_USER:
		case LOGIN_USER:
			const { name, username, have, need, token } = action.payload;
			return { ...state, name, username, have, need, token };
		case GET_USERS:
			return { ...state, allUsers: action.payload, loadedAllUsers: true };
		default:
			return state;
	}
}