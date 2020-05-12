// The flow. What do you do with a response from the server?
import io from 'socket.io-client';
import { GET_ALL_USERS } from './types';
import { onChatroomOpened } from './actions';
export default async function resFlow(URL, dispatch, type, formData) {

	// First, fetch. If we have form data (e.g. from /login), we want it to be a POST with POST data. 
	try {
		const res = !formData ? await fetch(URL)
			: await fetch(URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

		// Our server passes JSON if it's a 200. If it's an error message, it passes plain text. 
		if (res.status === 200) {
			const body = await res.json();

			// If we logged in, open up Socket.io connection for entire session. 
			const socket = io('/', { query: { token: body.token } });
			socket.on('error', console.error);
			socket.on('chatroom opened', onChatroomOpened);

			// If we are GET fetching all users, the response body is an array with all users. 
			const payload = type === FETCH_ALL_USERS ? body : {

				// Otherwise, if we are POST fetching, the response body is an object holding data about the user we just registered or logged in. 
				name: formData.name || body.name,
				username: formData.username || body.username,
				have: formData.have || body.have,
				need: formData.need || body.need,
				connections: body.connections || [],
				token: body.token,
				socket
			}

			dispatch({ type, payload });

			// If the res isn't json (see third comment), console.error the text. 
		} else {
			const body = await res.text();
			console.error(body);
		}
	} catch (error) { console.error(error); }
}

// SIDE NOTES
// The `||` in our payload to the reducer: If we came from /register, we can pull all the user data from the form and so the server only sends back a JWT. If we came from /login, we can only pull the username from the form and the rest of the user data the server sends back. Only send data to the client that the client doesn't already have, it's faster. Hence the `||` – we prefer the formData first, but if the property isn't on the formData object, we fall back on the response body. 

/**
 * Idea: `v === a || v === b` is almost 2x longer than `e(v, a, b)`.
 *
 * function e(val, ...vals) {
 *   if (vals.length === 0) return false;
 *   return val === vals[0] ? true : e(val, vals.slice(1));
 * }
 * 
 * e is for equal, ea is for equal all: 
 * 
 * function ea(val, ...vals) {
 *   if (vals.length === 0) return true;
 *   return val !== vals[0] ? false : ea(val, vals.slice(1));
 * }
 */