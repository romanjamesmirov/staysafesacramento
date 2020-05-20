import store from './store';
import authenticate from './authenticate';

export const REGISTER = 'REGISTER'; //⬇POST actions
export const LOGIN = 'LOGIN';
export const MESSAGE = 'MESSAGE';
export const register = formData => dispatch => {
	const payload = authenticate(formData, 'register');
	if (!!payload) dispatch({ type: REGISTER, payload });
}
export const login = formData => dispatch => {
	const payload = authenticate(formData, 'login');
	if (!!payload) dispatch({ type: LOGIN, payload });
}
export const message = (to, text) => dispatch => {
	const { token, username } = store.getState().data;
	const headers = //⬇POST message
		{ 'Content-Type': 'text/plain', 'Authorization': `Bearer ${token}` };
	fetch(`/api/chat/${to}`, { method: 'POST', headers, body: text })
		.then(res => {
			if (res.status !== 200) throw new Error();
			const message = { from: username, when: new Date(), text }; //⬇dispatch
			dispatch({ type: MESSAGE, payload: { to, message } });
		})
		.catch(e => console.error('Failed to save new message'));
};

export const GET_ALL_USERS = 'GET_ALL_USERS'; //⬇GET actions
export const GET_CONTACTS = 'GET_CONTACTS';
export const GET_CHAT = 'GET_CHAT';
export const getAllUsers = () => dispatch => {
	try {
		const res = await fetch('/api/users'); // no query params = all users
		if (res.status !== 200) throw new Error('Could not get users');
		res.json().then(payload => dispatch({ type: GET_ALL_USERS, payload }));
	} catch (error) { console.error(error); }
}
export const getContacts = contacts => dispatch => {
	const usernames = contacts.map(({ username }, index) => username);
	try { // query params = just give me these users
		const res = await fetch(`/api/users?usernames=${usernames.join(',')}`); 
		if (res.status !== 200) throw new Error('Could not get users');
		res.json().then(payload => dispatch({ type: GET_CONTACTS, payload }));
	} catch (error) { console.error(error); }
}
export const getChat = to => dispatch => {
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