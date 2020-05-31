import React, { Component } from 'react';
import { connect } from 'react-redux'; // redux
import { Redirect } from 'react-router-dom'; // router
import { SupplyIconsList } from './Supplies';
import moment from 'moment';
import { SendIcon } from './Icons';

class Chat extends Component { // boilerplate
	constructor(props) {
		super(props);
		this.state = {
			contact: undefined,
			allMessages: [],
			chatUsers: [],
			newMsg: '',
			'404': false, // is there a user with the username from the URL?
			'401': false // are you authorized to load chats?
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.loadContact = this.loadContact.bind(this);
		this.loadAllMessages = this.loadAllMessages.bind(this);
	}

	/* OK, no. Completely redo this. Pass user metadata from Home or Chats, otherwise, if this is the first page in the session, fetch. Next, fetch the chat. Next, add a UI refresh button that fetches the chat BUT with a ?isNotFirstLoad query param. */
	async componentDidMount() {
		if (!this.props.token) return this.setState({ '401': true }); // authorized?
		await this.loadContact(this.loadAllMessages);
	}

	async loadContact(next) {
		try {
			if (this.props.location.state && this.props.location.state.user) {
				this.setState({ contact: this.props.location.state.user }, next);
			} else { // if we didn't come from Home or Chats, fetch the contact's data
				const res = await fetch(`/api/users?usernames=${this.props.match.params.username}`);
				if (res.status !== 200) return this.setState({ '404': true }); // redo, just use state.errorMessage
				res.json().then(users => this.setState({ contact: users[0] }, next));
			}
		} catch (error) { this.setState({ errorMessage: error.message }); }
	}

	async loadAllMessages() {
		const { contact } = this.state;
		if (this.props.contacts.length === 0) return;
		for (let i = 0; i < this.props.contacts.length; i++) {
			if (this.props.contacts[i].contact_id === contact._id) break;
			if (i === this.props.contacts.length - 1) return;
		} // skip loading all messages if they haven't talked before
		try {
			const headers = { Authorization: `Bearer ${this.props.token}` };
			const res = await fetch(`/api/chat/${contact.username}`, { headers });
			if (res.status !== 200) throw new Error('Could not load previous messages');
			res.json().then(({ users, allMessages }) =>
				this.setState({ allMessages, chatUsers: users }));
		} catch (error) { this.setState({ errorMessage: error.message }); }
	}

	async onSubmit(e) { // wait for a msg submit...
		e.preventDefault();
		const { contact, newMsg, chatUsers } = this.state;
		if (!contact) return;
		const { token, _id } = this.props;
		const body = { contact_id: contact._id, msg: newMsg }, method = 'POST',
			headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
		try {
			const res = await fetch(`/api/message`, { body: JSON.stringify(body), method, headers });
			if (res.status !== 200) throw new Error('Message could not send');
		} catch (error) { return this.setState({ errorMessage: error.message }); }
		const from = chatUsers[0] === _id ? 1 : 0;
		const msgFormatted = { text: newMsg, from, when: new Date() };
		this.setState(state => ({ allMessages: [...state.allMessages, msgFormatted], newMsg: '' }));
	}

	onChange({ target }) { this.setState({ newMsg: target.value }); } // control

	render() {
		const contactUsername = this.props.match.params.username;
		if (this.state['401']) return <Redirect to={{ pathname: '/login', state: { next: `/${contactUsername}` } }} />; // log in and come back
		const { contact, newMsg, allMessages, chatUsers } = this.state;
		if (!contact) return <h1>Loading...</h1>; // not yet loaded 
		if (this.state['404']) return <main><h1>Nobody has the username <i>{contactUsername}</i>.</h1></main>; // loaded with an error

		return (<main id="Chat-page">
			<h1>{contact.name}</h1>

			<div id="Chat-page-need">
				<span>Needs: </span><SupplyIconsList supplies={contact.need} /></div>

			<div id="Chat-page-have">
				<span>Has: </span><SupplyIconsList supplies={contact.have} /></div>

			<ul id="Chats-list">{allMessages.map(({ from, when, text }, key) =>
				(<li key={key}>
					<p><b>{chatUsers[from] === contact._id ? contact.name : this.props.name}</b> {text}</p>
					<p>{moment(when).calendar()}</p></li>)
			)}</ul>

			{!this.state.errorMessage ? undefined
				: <div className="Error-message">{this.state.errorMessage}</div>}

			<form onSubmit={this.onSubmit}>
				<textarea value={newMsg} onChange={this.onChange} />
				<button type='submit'><SendIcon /></button>
			</form>
		</main>);
	}
};

const mapStateToProps = ({ data }) => {
	const { contacts, name, token } = data;
	return { contacts, name, token };
};
export default connect(mapStateToProps)(Chat);