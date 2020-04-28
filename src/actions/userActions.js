import { SET_USER, GET_USERS } from './types';

export const setUser = userData => async dispatch => {
	try {
		const res = await fetch('http://192.168.1.37:5000/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData)
		});
		let body;
		if (res.status === 200) {
			body = await res.json();
			const { name, username, have, need } = userData;
			dispatch({
				type: SET_USER,
				payload: { name, username, have, need, token: body.token }
			});
		} else {
			body = await res.text();
			console.error(body);
		}
	} catch (error) { console.error(error); }
}

export const getUsers = () => async dispatch => {
	try {
		const res = await fetch('http://192.168.1.37:5000/api/users');
		let body;
		if (res.status === 200) {
			body = await res.json();
			dispatch({ type: GET_USERS, payload: body });
		} else {
			body = await res.text();
			console.error(body);
		}
	} catch (error) { console.error(error); }
}