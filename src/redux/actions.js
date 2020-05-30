import store from './store';
import authenticate from './authenticate';

//⬇POST actions
export const REGISTER = 'REGISTER'; 
export const register = formData => async dispatch => {
	const payload = await authenticate(formData, 'register');
	console.log(payload)
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

//⬇GET actions
export const GET_ALL_USERS = 'GET_ALL_USERS'; 
export const getAllUsers = () => async dispatch => {
	try {
		const res = await fetch('/api/users'); // no query params = all users
		if (res.status !== 200) throw new Error('Could not get users');
		res.json().then(payload => dispatch({ type: GET_ALL_USERS, payload }));
	} catch (error) { console.error(error); }
}

export const GET_CONTACTS = 'GET_CONTACTS';
export const getContacts = contacts => async dispatch => {
	const usernames = contacts.map(({ username }, index) => username);
	try { // query params = just give me these users
		const res = await fetch(`/api/users?usernames=${usernames.join(',')}`); 
		if (res.status !== 200) throw new Error('Could not get users');
		res.json().then(payload => dispatch({ type: GET_CONTACTS, payload }));
	} catch (error) { console.error(error); }
}

export const GET_CHAT = 'GET_CHAT';
export const getChat = to => async dispatch => {
	const { token, contacts } = store.getState().data;
	const isNotFirstLoadParam = (function () { 
		for (let i = 0; i < contacts.length; i++) {
			if (contacts[i].username !== to) continue; 
			return !contacts[i].pastMessages ? '' : '?isNotFirstLoad';
		}
	}());
	try {
		const headers = { 'Authorization': `Bearer ${token}` }
		const res = await fetch(`/api/chat/${to}${isNotFirstLoadParam}`, headers);
		if (res.status !== 200) throw new Error('Could not get chat');
		res.json().then(payload => dispatch({ type: GET_CHAT, payload }));
	} catch (e) { console.error(e); }
}