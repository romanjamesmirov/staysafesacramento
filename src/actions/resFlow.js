import { FETCH_ALL_USERS } from './types';

export default async function resFlow(URL, dispatch, TYPE, formData) { // 1
	try { // 2
		let res;
		if (!formData) res = await fetch(URL);
		else { 
			res = await fetch(URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
		}
		if (res.status === 200) { // 3
			const body = await res.json();
			dispatch({
				type: TYPE,
				payload: TYPE === FETCH_ALL_USERS ? body : { // 4
					name: formData.name || body.name, // 5
					username: formData.username || body.username,
					have: formData.have || body.have,
					need: formData.need || body.need, 
					updates: body.updates || [],
					token: body.token,
				} 
			});
		} else { 
			const body = await res.text(); // 3
			console.error(body); 
		}
	} catch (error) { console.error(error); }
}

// 1. The response flow. What do you do with a response from the server for registering or logging in? Or loading all users? 

// 2. First, fetch. It's obviously a POST if you have form data (from /login or /register). 

// 3. Second, the server always passes JSON if it's a 200. If not, it's an error message, so console.error the text.  

// 4. Third, if we are loading all users, the response body is an array. If we are POSTing, the response body is an object holding data about the user. 

// 5. If we came from /register, the form contains all the user data and the server will just send back a JWT. If we came from /login, the form only contains the username and the server will send us the rest. Hence the double pipes. Either pull from the form or from the body. Minimize data packet size. 