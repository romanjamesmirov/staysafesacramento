import { SET_USER, GET_USERS } from '../actions/types';

const initialState = {
	name: '',
	username: '',
	have: [],
	need: [],
	token: '',
	allUsers: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			const { name, username, have, need, token } = action.payload;
			return { ...state, name, username, have, need, token };
		case GET_USERS:
			return { ...state, allUsers: action.payload };
		default:
			return state;
	}
}