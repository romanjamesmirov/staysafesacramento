import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import io from 'socket.io-client';
import { Supplycons } from './supplycon';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = { recipient: {}, newMsg: '', messages: [] };
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	async componentDidMount() {
		const { username } = this.props.match.params; //^
		const recipient = findWhere(this.props.allUsers, user => user.username === username);
		if (recipient.name === undefined) { 
			try { 
				const res = await fetch(`https://localhost:5000/api/users/${username}`);
				if (res.status === 200) {
					const recipient = await res.json();
					this.setState({ recipient });
				} else {
					const body = await res.text();
					this.setState({ recipient: null });
				}
			} catch (error) { console.error(error); }
		}
		else this.setState({ recipient });

		// this.socket = io('https://localhost:5000');
		// handle an emitted chat message from the server
		// this.socket.on('chat message', msg => {
		// 	this.setState(state => ({ messages: [...this.state.messages, msg] }));
		// });
	}

	onSubmit(e) { // emit a chat message from this socket to the server
		e.preventDefault();
		// this.socket.emit('chat message', this.state.newMsg);
		this.setState({ newMsg: '' });
	}

	onChange({ target }) { this.setState({ newMsg: target.value }); }

	render() {
		if (this.props.token === '') return <Redirect to='/register' />;
		const { recipient, messages, newMsg } = this.state;
		if (recipient === null) return <h1>404 Not found</h1>;
		if (recipient.name === undefined) return <h1>Loading...</h1>;
		return (<Fragment>
			<div>
				<Link to='/'>X</Link>
			</div>
			<h1>{recipient.username}</h1>
			{Supplycons(recipient.have)}
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

//^ tylermcginnis.com/react-router-url-parameters

// IF TOKEN IS EMPTY IN REDUX STATE, REDIRECT. 
// IF NOT FOUND, IF LOADED ALL USERS, FIND USER IN ALL USERS IN REDUX. 
// IF NOT FOUND THERE, 404.

// CUSTOM FINDWHERE RECURSION BABY.
function findWhere(arr, callback) {
	if (arr.length === 0) return {};
	const thisIsIt = callback(arr[0]);
	return thisIsIt ? arr[0] : findWhere(arr.slice(1), callback);
}