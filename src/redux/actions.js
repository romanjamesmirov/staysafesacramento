import store from './store';
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

export const MESSAGE = 'MESSAGE';
export const message = (to, text) => dispatch => {
	const { token, username } = store.getState().data;
	const headers = 
		{ 'Content-Type': 'text/plain', 'Authorization': `Bearer ${token}` };
	try {
		const res = fetch(`/api/message/${to}`, { method: 'POST', headers, body: text });
		if (res.status !== 200) throw new Error('Could not save the new message');
		const message = { from: username, when: new Date(), text };
		dispatch({ type: MESSAGE, payload: { to, message } });
	} catch (error) { return error; }
};