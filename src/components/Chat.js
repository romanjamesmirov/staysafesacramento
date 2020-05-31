import React, { Component } from 'react';
import { connect } from 'react-redux'; // redux
import { Redirect } from 'react-router-dom'; // router
import { SupplyIconsList } from './Supplies';

class Chat extends Component { // boilerplate
	constructor(props) {
		super(props);
		this.state = {
			newMsg: '',
			'404': false, // true if no user has the username from the URL
			'401': false // true if you are unauthorized to load chats
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	// check if user is logged in to even be able to load chats...
	async componentDidMount() {
		if (!this.props.token) return this.setState({ '401': true });
		try { // then load the chat or display a Not Found
			const res = await fetch(`/api/users/${this.props.match.params.username}`);
			if (res.status !== 200) return this.setState({ '404': true });
			const contact = await res.json();
			this.setState({ contact });
		} catch (error) { console.error(error); }


	/* OK, no. Completely redo this. Pass user metadata from Home or Chats, otherwise, if this is the first page in the session, fetch. Next, fetch the chat. Next, add a UI refresh button that fetches the chat BUT with a isNotFirstLoad query param. */





		// const { token, contacts } = store.getState().data;
		// const isNotFirstLoadParam = (function () {
		// 	for (let i = 0; i < contacts.length; i++) {
		// 		if (contacts[i].username !== to) continue;
		// 		return !contacts[i].pastMessages ? '' : '?isNotFirstLoad';
		// 	}
		// }());
		// try {
		// 	const headers = { 'Authorization': `Bearer ${token}` }
		// 	const res = await fetch(`/api/chat/${to}${isNotFirstLoadParam}`, headers);
		// 	if (res.status !== 200) throw new Error('Could not get chat');
		// 	res.json().then(payload => dispatch({ type: GET_CHAT, payload }));
		// } catch (e) { console.error(e); }
	}

	onSubmit(e) { // wait for a msg submit...
		e.preventDefault();
		const { contact, newMsg } = this.state;
		if (!contact) return;
		const { name, message } = this.props;
		message(contact.username, newMsg); // first, send it to the other person...
		const newMsgFormatted = { text: newMsg, from: name, when: new Date() };
		this.setState(state => ({ // then, update the current user's screen
			contact: {
				...state.contact, pastMessages: [...state.pastMessages, newMsgFormatted]
			},
			newMsg: ''
		}));
	}

	onChange({ target }) { this.setState({ newMsg: target.value }); } // control

	render() {
		const contactUsername = this.props.match.params.username;
		if (this.state['401']) return <Redirect to={{ pathname: '/login', state: { next: `/${contactUsername}` } }} />; // log in and come back
		const { contact, newMsg } = this.state;
		if (!contact) return <h1>Loading...</h1>; // not yet loaded 
		if (this.state['404']) return <main><h1>Nobody has the username <i>{contactUsername}</i>.</h1></main>; // loaded with an error
		return (<main> {/* GUI */}
			<h1>{contact.name}</h1>
			<div><span>Needs: </span>{SupplyIconsList(contact.need)}</div>
			<div><span>Has: </span>{SupplyIconsList(contact.have)}</div>
			<ul>{contact.pastMessages.map((msg, key) => <li key={key}>{msg.from} at {msg.when.toString()}: {msg.text}</li>)}</ul>
			<form onSubmit={this.onSubmit}>
				<textarea value={newMsg} onChange={this.onChange} />
				<button type='submit'>Send</button>
			</form>
		</main>);
	}
};

const mapStateToProps = state => {
	const { contacts, allUsers, name, token } = state.data;
	return { contacts, allUsers, name, token };
};
export default connect(mapStateToProps)(Chat);