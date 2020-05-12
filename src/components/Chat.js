import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadChat } from '../redux/actions';
import { Redirect, Link } from 'react-router-dom';
import { Supplycons } from './supplycon';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			'404': false, // No user with :username found.
			recipient: {},
			'401': false, // Unauthorized to load a chatroom. 
			chatroom: [],
			newMsg: '',
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	// Outcome A: Display a Not Found instead of the chatroom. You show this message if either...
	async componentDidMount() {
		const { username } = this.props.match.params; // Router GET parameters. 
		const { allUsers } = this.props;

		// ...redux loaded all users and :username is not a username of any user in the redux all users array or...
		if (!!allUsers) {
			const recipient = findBy(allUsers, { username });
			if (recipient === null) return this.setState({ '404': true });
			this.setState({ recipient }, this.ok);
		} else {

			// ...redux did not load all users and fetching /api/users/:username returns a 404. 
			try {
				const res = await fetch(`/api/users/${username}`);
				if (res.status !== 200) return this.setState({ '404': true });
				const recipient = await res.json();
				this.setState({ recipient }, this.ok);
			} catch (error) { console.error(error); }
		}
	}

	// If we got past Outcome A, call ok() – for 200 OK. 
	async ok() {
		const { token, connections } = this.props;
		const { username } = this.state.recipient;

		// Outcome B is to display the register form instead of the chatroom, with a message telling the user to register if they want to talk to :username. If the user is not logged in. 
		if (!token) return this.setState({ '401': true });

		// Outcome C is to display the chatroom. If they've talked before, the recipient will be in the sender's connections array in redux. If :username is in the redux connections array, fetch /api/chatroom/:username to load the previous chats...
		if (findBy(connections, { username }) !== null) {
			this.props.
			this.props.socket.emit('subscribe', this.props.match.params.username);
			try {

				if (res.status !== 200) {
					const error = await res.text();
					console.error(error);
				} else {
					const chatroom = await res.json();
					this.setState({ chatroom });
				}
			} catch (error) { console.error(error); }
		}
	}

	// ...If :username is not in the connections array, don't fetch. Either way, proceed to wait for the submission of a message. 
	onSubmit(e) {
		e.preventDefault();
		const { chatroom, newMsg, recipient } = this.state;
		this.setState({ chatroom: [...chatroom, newMsg], newMsg: '' });

		// If a socket connection is not already open, open one...
		if (this.socket === undefined) {
			this.socket = io('/', { query: { token: this.props.token } });
			// this.socket.emit('join chatroom', 'hey' /* this.state.chatroom.id */);
			this.socket.on('user message', msg => {
				this.setState(state => ({ chatroom: [...state.chatroom, msg] }));
			});
		}

		// ...If it is open, emit the message. 
		this.socket.emit('user message', newMsg);
	}

	onChange({ target }) { this.setState({ newMsg: target.value }); }

	componentWillUnmount() {
		if (this.socket !== undefined) this.socket.close();
	}

	render() {
		const { recipient, chatroom, newMsg } = this.state;
		if (this.state['404']) return (<Fragment>
			<div><Link to='/'>X</Link></div>
			<h1>Nobody has the username <i>{this.props.match.params.username}</i>.</h1>
		</Fragment>);
		if (this.state['401']) return <Redirect to='/register' />;
		return (<Fragment>
			<div><Link to='/'>X</Link></div>
			<h1>{recipient.name}</h1>
			<div><span>Needs: </span>{Supplycons(recipient.need)}</div>
			<div><span>Has: </span>{Supplycons(recipient.have)}</div>
			<ul>{chatroom.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
			<form onSubmit={this.onSubmit}>
				<textarea value={newMsg} onChange={this.onChange} />
				<button type='submit'>Send</button>
			</form>
		</Fragment >);
	}
};

function findBy(arr, vals) { // MY CUSTOM RECURSIVE FUNCTION 
	if (arr.length === 0) return null; // ...to find in an array
	for (let key in Object.keys(vals)) {
		if (vals[key] !== arr[0][key]) return findBy(arr.slice(1), vals);
	} // ...of objects
	return arr[0]; // ...an object with matching key values. 
}

Chat.propTypes = { loadChat: PropTypes.func.isRequired };
const mapStateToProps = state => {
	const { allUsers, token, connections, socket } = state.data;
	return { allUsers, token, connections, socket };
};
export default connect(mapStateToProps, { loadChat })(Chat);

// RESOURCES
// tylermcginnis.com/react-router-url-parameters