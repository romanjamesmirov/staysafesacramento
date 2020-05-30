import React, { Component } from 'react';
import { connect } from 'react-redux'; // redux
import PropTypes from 'prop-types';
import { message } from '../redux/actions';
import { Redirect } from 'react-router-dom'; // router
import { Supplycons } from './supplycon';

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
			<div><span>Needs: </span>{Supplycons(contact.need)}</div>
			<div><span>Has: </span>{Supplycons(contact.have)}</div>
			<ul>{contact.pastMessages.map((msg, key) => <li key={key}>{msg.from} at {msg.when.toString()}: {msg.text}</li>)}</ul>
			<form onSubmit={this.onSubmit}>
				<textarea value={newMsg} onChange={this.onChange} />
				<button type='submit'>Send</button>
			</form>
		</main>);
	}
};

Chat.propTypes = { message: PropTypes.func.isRequired };
const mapStateToProps = state => {
	const { contacts, allUsers, name, token } = state.data;
	return { contacts, allUsers, name, token };
};
export default connect(mapStateToProps, { message })(Chat);