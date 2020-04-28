import { REGISTER_USER, LOGIN_USER, GET_USERS } from './types';

export const registerUser = userData => async dispatch => {
	resFlow('http://192.168.1.37:5000/api/auth/register', dispatch, REGISTER_USER, userData);
}

export const loginUser = userData => async dispatch => {
	resFlow('http://192.168.1.37:5000/api/auth/login', dispatch, LOGIN_USER, userData);
}

export const getUsers = () => async dispatch => {
	resFlow('http://192.168.1.37:5000/api/users', dispatch, GET_USERS);
}

// Repeated structure for my three actions here: fetch, console.error if it fails. 200 OK -> json() + dispatch with or without formData pulled from form and res.body. Not 200 OK -> text() + console.error.
async function resFlow(link, dispatch, type, formData) {
	try {
		let res;
		if (!formData) res = await fetch(link);
		else { // If we have form data then obviously it's a POST.
			res = await fetch(link, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
		}
		if (res.status === 200) { // If 200, we always do JSON.
			const body = await res.json();
			dispatch({
				type, 
				// The request body contains an array of all users if we're doing that. If we aren't, the body contains an object. It holds some data about the user if we logged in or registered as well as the JWT.
				payload: type === GET_USERS ? body : {
					name: formData.name || body.name,
					username: formData.username || body.username,
					have: formData.have || body.have,
					need: formData.need || body.need,
					token: body.token,
				} // If the user registered, the server won't send back user data because we can just grab it from the form. Just the JWT. If the user logged in, we only have the username from the form, so the server sends back the rest. Hence the double pipes. 
			});
		} else { // If not 200, console.error a simple text string.
			const body = await res.text();
			console.error(body);
		}
	} catch (error) { console.error(error); }
}