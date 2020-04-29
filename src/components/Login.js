import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/userActions';
import { Redirect, Link } from 'react-router-dom';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		const { username, password } = this.state;
		this.props.loginUser({ username, password });
	}

	onChange({ target }) { this.setState({ [target.name]: target.value }); }

	render() {
		if (this.props.token !== '') return <Redirect to='/' />;

		return (
			<Fragment>
				<div>
					<Link to='/'>X</Link>
					<Link to='/register'>Register</Link>
				</div>
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

Login.propTypes = { loginUser: PropTypes.func.isRequired };

const mapStateToProps = state => ({ token: state.user.token });

export default connect(mapStateToProps, { loginUser })(Login);