import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import io from 'socket.io-client';
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

	async componentDidMount() { // Get past Outcome A (see end comments).
		const { username } = this.props.match.params; //R1
		const { allUsers, loadedAllUsers } = this.props;
		if (loadedAllUsers) { 
			const recipient = findWhere(allUsers, user => user.username === username);
			if (recipient === null) this.setState({ '404': true }); 
			else this.setState({ recipient }, this.ok);
		} else {
			try { 
				const res = await fetch(`https://localhost:5000/api/users/${username}`);
				if (res.status !== 200) this.setState({ '404': true });
				else {
					const recipient = await res.json();
					this.setState({ recipient }, this.ok);
				}
			} catch (error) { console.error(error); }
		}
	}
	
	ok() { // Get past Outcome B and C. 
		const { token, connections } = this.props;
		const { username } = this.state.recipient;
		if (token === '') this.setState({ '401': true }); 
		else { 
			if (findWhere(connections, user => user.username === username) !== null) {
				try {
					const res = await fetch(`https://localhost:5000/api/chatroom/${username}`, {
						method: 'GET',
						headers: { 'Authorization': `Bearer ${token}` }
					});
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
	}

	onSubmit(e) { // This is where the magic happens. 
		e.preventDefault();
		// this.socket = io('https://localhost:5000');
		// handle an emitted chat message from the server
		// this.socket.on('chat message', msg => {
		// 	this.setState(state => ({ messages: [...this.state.messages, msg] }));
		// });
		if (this.state.loadedRecipient && )
		// this.socket.emit('chat message', this.state.newMsg);
		this.setState({ newMsg: '' });
	}

	onChange({ target }) { this.setState({ newMsg: target.value }); }

	render() {
		const { recipient, loadedRecipient, messages, newMsg } = this.state;
		if (!loadedRecipient) return <h1>Loading...</h1>;
		else if (this.props.token === '') return <Redirect to='/register' />;
		if (recipient === null) return (<Fragment>
			<div><Link to='/'>X</Link></div>
			<h1>404 Not found</h1>
		</Fragment>);
		return (<Fragment>
			<div><Link to='/'>X</Link></div>
			<h1>{recipient.name}</h1>
			<div><span>Needs: </span>{Supplycons(recipient.need)}</div>
			<div><span>Has: </span>{Supplycons(recipient.have)}</div>
			<ul>{messages.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
			<form onSubmit={this.onSubmit}>
				<textarea value={newMsg} onChange={this.onChange} />
				<button type='submit'>Send</button>
			</form>
		</Fragment >);
	}
};

const mapStateToProps = state => ({
	token: state.data.token,
	fetchedAllUsers: state.data.fetchedAllUsers,
	allUsers: state.data.allUsers
});
export default connect(mapStateToProps)(Chat);

// RESOURCES
// R1. tylermcginnis.com/react-router-url-parameters

// CUSTOM FINDWHERE RECURSION BABY.
function findWhere(arr, callback) {
	if (arr.length === 0) return {};
	const thisIsIt = callback(arr[0]);
	return thisIsIt ? arr[0] : findWhere(arr.slice(1), callback);
}

// CHATROOM FLOW
// Outcome A: Display a "404 [username] not found" instead of the chatroom. You show this message if A) redux loaded all users and :username does not exist in redux all users array or B) if all users were not loaded and you fetch /api/users/:username and the response is a 404. 
// Outcome B: Display the register form instead of the chatroom with the message "Register if you want to talk to [username]." You show this message and form if A) all users have been loaded and the username belongs to somebody but the requester is not logged in or B) all users have not been loaded and the fetch /api/users/:username is a 200 but the requester is not logged in. 
// Outcome C: Display the chatroom. You do this if the requester is logged in and the username is valid. If the username is in the requester's connections array in redux, fetch /api/chatroom/:username. If the username is not in the connections array, don't fetch. Either way, proceed to wait for the submission of a message. If a socket connection is not already open, open one. If it is open, emit the message. 