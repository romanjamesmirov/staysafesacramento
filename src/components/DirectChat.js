import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Supplycons } from './supplycon';

class DirectChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			msg: '',
			messages: []
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.socket = io('http://192.168.1.37:5000');
		// handle an emitted chat message from the server
		this.socket.on('chat message', msg => {
			this.setState(state => ({ messages: [...this.state.messages, msg] }));
		});
	}

	onSubmit(e) { // emit a chat message from this socket to the server
		e.preventDefault();
		this.socket.emit('chat message', this.state.msg);
		this.setState({ msg: '' });
	}

	onChange({ target }) {
		this.setState({ msg: target.value });
	}

	render() {
		if (!this.props.loadedAllUsers) return <Fragment />;
		const { username } = this.props.match.params; //^
		const userExists = this.props.allUsers;
		console.log(userExists)
		
		return (<Fragment>
			{/* <h1>{username}</h1>
			{Supplycons(person.has)}
			<ul>{this.state.messages.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
			<form onSubmit={this.onSubmit}>
				<textarea value={this.state.msg} onChange={this.onChange} />
				<button type='submit'>Send</button>
			</form> */}
		</Fragment>);
	}
};

const mapStateToProps = state => ({
	loadedAllUsers: state.user.loadedAllUsers,
	allUsers: state.user.allUsers
});
export default connect(mapStateToProps)(DirectChat);

//^ https://tylermcginnis.com/react-router-url-parameters/ 