// Register is a type of login... So log in and save user metadata in store
export default async (formData, type) => {
	try {
		const method = 'POST', body = JSON.stringify(formData),
			headers = { 'Content-Type': 'application/json' };
		const res = await fetch(`/api/${type}`, { method, body, headers });
		if (res.status !== 200) throw new Error((await res.text()));
		const resBody = await res.json();
		const payload = {
			name: resBody.name || formData.name, // *
			username: resBody.username || formData.username,
			have: resBody.have || formData.have,
			need: resBody.need || formData.need,
			contacts: resBody.contacts || [],
			token: resBody.token
		};
		return payload;
	} catch (error) { return error; }
};

// *`||` the server won't send us back most of the user data if we registered since it'll be the same as the formData from the register page, so... 