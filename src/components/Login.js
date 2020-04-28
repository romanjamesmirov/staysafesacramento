import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/userActions';
import { Redirect } from 'react-router-dom';

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			toPeopleList: false 
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		const { username, password } = this.state;
		this.props.loginUser({ username, password });
		this.setState({ toPeopleList: true });
	}

	onChange({ target }) { this.setState({ [target.name]: target.value }); }

	render() {
		if (this.state.toPeopleList) return <Redirect to='/' />;

		return (
			<Fragment>
				<h1>Login</h1>

				<form action="#" onSubmit={this.onSubmit}>
					<div>
						<label htmlFor="id_username">Username</label>
						<input type="text" id="id_username" name="username"
							value={this.state.username} onChange={this.onChange} /></div>

					<div>
						<label htmlFor="id_password">Password</label>
						<input type="password" id="id_password" name="password"
							value={this.state.password} onChange={this.onChange} /></div>

					<button type="submit">Login</button>
				</form>
			</Fragment>
		);
	}
}

Register.propTypes = { loginUser: PropTypes.func.isRequired };

export default connect(null, { loginUser })(Register);