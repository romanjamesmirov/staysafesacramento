import React, { Fragment, Component } from 'react';
import axios from 'axios';

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			username: '',
			password: ''
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		const { name, username, password } = this.state;
		axios.post('http://192.168.1.37:5000/api/auth/register',
			{ name, username, password })
			.then(res => console.log(res))
			.catch(error => console.error(error.response.data));
	}

	onChange({ target }) {
		this.setState({ [target.name]: target.value });
	}

	render() {
		return (
			<Fragment>
				<h1>Register</h1>

				<form action="#" onSubmit={this.onSubmit}>
					<div>
						<label htmlFor="id_name">Name</label>
						<input type="text" id="id_name" name="name"
							value={this.state.name} onChange={this.onChange} /></div>

					<div>
						<label htmlFor="id_username">Username</label>
						<input type="text" id="id_username" name="username"
							value={this.state.username} onChange={this.onChange} /></div>

					<div>
						<label htmlFor="id_password">Password</label>
						<input type="password" id="id_password" name="password"
							value={this.state.password} onChange={this.onChange} /></div>

					<button type="submit">Register</button>
				</form>
			</Fragment>
		);
	}
}