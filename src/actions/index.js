import { AUTH_REGISTER, AUTH_LOGIN, FETCH_ALL_USERS } from './types';
import resFlow from './resFlow';

export const authRegister = userData => async dispatch => {
	resFlow('https://localhost:5000/api/auth/register', dispatch, AUTH_REGISTER, userData);
};

export const authLogin = userData => async dispatch => {
	resFlow('https://localhost:5000/api/auth/login', dispatch, AUTH_LOGIN, userData);
};

export const fetchAllUsers = () => async dispatch => {
	resFlow('https://localhost:5000/api/users', dispatch, FETCH_ALL_USERS);
};

// export const fetchChat = token => async dispatch => {
// 	try {
// 		const res = await fetch('https://localhost:5000/api/chat', {
// 			method: 'GET',
// 			headers: { 'Authorization': `Bearer ${token}` }
// 		});
// 		if (res.status === 200) { 
// 			const body = await res.json();
// 			dispatch({
// 				type: FETCH_CHAT,
// 				payload: {

// 				}
// 			});
// 		} else {
// 			const body = await res.text();
// 			console.error(body);
// 		}
// 	} catch (error) { console.error(error); }
// };