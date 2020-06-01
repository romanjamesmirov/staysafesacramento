import authenticate from './authenticate';

export const REGISTER = 'REGISTER'; 
export const register = formData => async dispatch => {
	const payload = await authenticate(formData, 'register');
	if (payload instanceof Error) return payload;
	dispatch({ type: REGISTER, payload });
}

export const LOGIN = 'LOGIN';
export const login = formData => async dispatch => {
	const payload = await authenticate(formData, 'login');
	if (payload instanceof Error) return payload;
	dispatch({ type: LOGIN, payload });
}

export const ADD_CONTACT = 'ADD_CONTACT';
export const addContact = contact => dispatch =>
	dispatch({ type: ADD_CONTACT, payload: contact });