import React, { Fragment, Component } from 'react'
import io from 'socket.io-client'
import { Supplycons } from './supplyMethods'

export default class DirectChat extends Component {
	constructor(props) {
		super(props)
		this.state = {
			msg: '',
			messages: []
		}
		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	componentDidMount() {
		this.socket = io('http://192.168.1.37:5000')
		// handle an emitted chat message from the server
		this.socket.on('chat message', msg => {
			this.setState(state => ({ messages: [...state.messages, msg] }))
		})
	}

	onSubmit(e) { // emit a chat message from this socket to the server
		e.preventDefault()
		this.socket.emit('chat message', this.state.msg)
		this.setState({ msg: '' })
	}

	onChange({ target }) {
		this.setState({ msg: target.value })
	}

	render() {
		const { person } = this.props.location.state
		return (
			<Fragment>
				<h1>{person.name}</h1>
				{Supplycons(person.has)}
				<ul>{this.state.messages.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
				<form onSubmit={this.onSubmit}>
					<textarea value={this.state.msg} onChange={this.onChange} />
					<button type='submit'>Send</button>
				</form>
			</Fragment>
		)
	}
}