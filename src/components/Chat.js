import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from '../redux/actions';
// Redux up top, router down bottom
import { Redirect, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Supplycons } from './supplycon';

// React boilerplate
class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contact: [], // Element from redux `contacts` array
			newMsg: '',
			'404': false, // No user with :username found.
			'401': false // Unauthorized to load a chat. 
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	// Outcome A: Display a Not Found instead of the chat. Check `contacts`, then `allUsers`, THEN make an API request for the user.
	async componentDidMount() {
		const { contacts, allUsers, match } = this.props;
		const { username } = match.params; // Router GET params
		let { contact } = this.props.location.state; // If we clicked on this chat from /chats
		if (!!contact) return this.setState({ contact }, this.check401);
		if (!!contacts) contact = findByUsername(contacts, username);
		if (!!contact) return this.setState({ contact }, this.check401);
		if (!!allUsers) contact = findByUsername(allUsers, username);
		if (!!contact) return this.setState({ contact }, this.check401);
		try {
			const res = await fetch(`/api/user/${username}`);
			if (res.status !== 200) return this.setState({ '404': true });
			contact = await res.json();
			this.setState({ contact }, this.check401);
		} catch (error) { console.error(error); }
	}

	// Outcome B: display the login form instead of the chat
	async check401() {
		const { token } = this.props;
		if (!token) return this.setState({ '401': true });
	}

	// Outcome C: display the chat, with or without previous messages (state.chat.pastMessages) depending on if the current user has chatted with the contact before, and wait for a msg submit
	onSubmit(e) {
		e.preventDefault();
		const { contact, newMsg } = this.state;
		const { name, message } = this.props;
		const formatted = { text: newMsg, from: name, when: new Date() };
		const pastMessages = [...contact.pastMessages, formatted];
		message('send message', { to: contact.username, newMsg });
		this.setState({ contact: { ...contact, pastMessages }, newMsg: '' });
	}

	// Make message field controlled
	onChange({ target }) { this.setState({ newMsg: target.value }); }

	// The GUI
	render() {
		const { contact, newMsg } = this.state;
		const contactUsername = this.props.match.params.username;
		if (this.state['404']) {
			return (<Fragment>
				<Navbar />
				<h1>Nobody has the username <i>{contactUsername}</i>.</h1>
				<Footer />
			</Fragment>);
		}
		if (this.state['401']) return <Redirect to={{ pathname: '/login', state: { next: `/${contactUsername}` } }} />;
		return (<Fragment>
			<Navbar />
			<h1>{contact.name}</h1>
			<div><span>Needs: </span>{Supplycons(contact.need)}</div>
			<div><span>Has: </span>{Supplycons(contact.have)}</div>
			<ul>{contact.pastMessages.map((msg, key) => <li key={key}>{msg.from} at {msg.when.toString()}: {msg.text}</li>)}</ul>
			<form onSubmit={this.onSubmit}>
				<textarea value={newMsg} onChange={this.onChange} />
				<button type='submit'>Send</button>
			</form>
			<Footer />
		</Fragment>);
	}
};

function findByUsername(users, username) { // CUSTOM RECURSION 
	if (users.length === 0) return null;
	if (users[0].username !== username) return findByUsername(users.slice(1), username);
	return users[0];
}

Chat.propTypes = { message: PropTypes.func.isRequired };
const mapStateToProps = state => {
	const { contacts, allUsers, name, token } = state.data;
	return { contacts, allUsers, name, token };
};
export default connect(mapStateToProps, { message })(Chat);