import { AUTH_REGISTER, AUTH_LOGIN, FETCH_ALL_USERS } from './types';
import resFlow from './resFlow';

export const authRegister = userData => async dispatch => {
	resFlow('/api/auth/register', dispatch, AUTH_REGISTER, userData);
};

export const authLogin = userData => async dispatch => {
	resFlow('/api/auth/login', dispatch, AUTH_LOGIN, userData);
};

export const fetchAllUsers = () => async dispatch => {
	resFlow('/api/users', dispatch, FETCH_ALL_USERS);
}; 

// RESOURCES
// #R1 – Why didn't I prepend "http://localhost:5000/" to my URLs? I set "proxy" in package.json. create-react-app.dev/docs/proxying-api-requests-in-development It's http in development and https in production... Since in production, React is built in /build and served by Express, so the server and client are of the same origin in Heroku. 