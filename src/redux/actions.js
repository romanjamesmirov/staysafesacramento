import { REGISTER, LOGIN, GET_ALL_USERS, CHAT_LOADED, RECEIVE_MESSAGE, SEND_MESSAGE } from './types';
import store from './store';
import resFlow from './resFlow';

export const register = userData => dispatch =>
	resFlow('/api/register', dispatch, REGISTER, userData);

export const login = userData => dispatch =>
	resFlow('/api/login', dispatch, LOGIN, userData);

export const getAllUsers = () => dispatch =>
	resFlow('/api/users', dispatch, GET_ALL_USERS);

export const chatLoaded = payload => dispatch =>
	dispatch({ type: CHAT_LOADED, payload });

export const receiveMessage = payload => dispatch =>
	dispatch({ type: RECEIVE_MESSAGE, payload });

export const sendMessage = (to, text) => dispatch => {
	const state = store.getState();
	const { socket } = state.data;
	socket.emit('send message', { to, text });
	const when = new Date();
	dispatch({ type: SEND_MESSAGE, payload: { text, to, when } });
};

// RESOURCES
// #R1 – Why didn't I prepend "http://localhost:5000/" to my URLs? I set "proxy" in package.json. create-react-app.dev/docs/proxying-api-requests-in-development It's http in development and https in production... Since in production, React is built in /build and served by Express, so the server and client are of the same origin in Heroku. 
// #R2 – Access redux state outside component – daveceddia.com/access-redux-store-outside-react