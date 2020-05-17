import store from './store';
import authenticate from './authenticate';

// types
export const REGISTER = 'REGISTER'; 
export const LOGIN = 'LOGIN';
export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_CONTACTS = 'GET_CONTACTS';
export const CHAT_LOADED = 'CHAT_LOADED'; 
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'; 
export const SEND_MESSAGE = 'SEND_MESSAGE'; 

// POST actions – authentication
export const register = formData => dispatch => authenticate(REGISTER, dispatch, formData);
export const login = formData => dispatch => authenticate(LOGIN, dispatch, formData);

// GET actions – users
export const getAllUsers = () => dispatch => {
	try {
		const res = await fetch('/api/users');
		const payload = res.status === 200 ? await res.json() : await res.text();
		if (res.status === 200) return dispatch({ type: GET_ALL_USERS, payload });
		console.error(payload);
	} catch (error) { console.error(error); }
}
export const getContacts = contacts => dispatch => {
	const usernames = contacts.map(contact => contact.username);
	const URL = `/api/users?${contacts.map((username, index) => `&${index}=${username}`).join('').slice(1)}`;
	try { 
		const res = await fetch(URL);
		const payload = res.status === 200 ? await res.json() : await res.text();
		if (res.status === 200) return dispatch({ type: GET_CONTACTS, payload });
		console.error(payload);
	} catch (error) { console.error(error); }
}

// server-emitted socket.io events
export const chatLoaded = payload => dispatch =>
	dispatch({ type: CHAT_LOADED, payload });
export const receiveMessage = payload => dispatch =>
	dispatch({ type: RECEIVE_MESSAGE, payload });

// client-emitted socket.io events
export const sendMessage = (to, text) => dispatch => {
	store.getState().data.socket.emit('send message', { to, text });
	const when = new Date();
	dispatch({ type: SEND_MESSAGE, payload: { text, to, when } });
};

// RESOURCES
// #R1 – Why didn't I prepend "http://localhost:5000/" to my URLs? I set "proxy" in package.json. create-react-app.dev/docs/proxying-api-requests-in-development It's http in development and https in production... Since in production, React is built in /build and served by Express, so the server and client are of the same origin in Heroku. 
// #R2 – Access redux state outside component – daveceddia.com/access-redux-store-outside-react