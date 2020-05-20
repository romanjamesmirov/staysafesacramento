// Register = create then log in, Login = find then log in. So log in and save user metadata (from form or res) + new socket connection in redux. 
import io from 'socket.io-client';
async function authenticate(formData, type) {
	try {
		const res = await fetch(`/api/${type}`, {
			method: 'POST', body: JSON.stringify(formData),
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.status === 200) {
			const body = await res.json();
			const payload = {
				name: formData.name || body.name,
				username: formData.username || body.username,
				have: formData.have || body.have,
				need: formData.need || body.need,
				contacts: body.contacts || [],
				token: body.token,
				socket: io('/', {
					query: {
						token: body.token,
						contacts: (body.contacts || []).map(contact => contact.username)
					}
				})
			};
			return payload;
		}
		// Our server passes JSON if it's a 200. If it's an error message, it passes plain text. 
		const error = await res.text();
		console.error(error);
	} catch (error) { console.error(error); }
}

// SIDE NOTES
// The `||` in our payload to the reducer: If we came from /register, we can pull all the user data from the form and so the server only sends back a JWT. If we came from /login, we can only pull the username from the form and the rest of the user data the server sends back. Only send data to the client that the client doesn't already have, it's faster. Hence the `||` – we prefer the formData first, but if the property isn't on the formData object, we fall back on the response body. 