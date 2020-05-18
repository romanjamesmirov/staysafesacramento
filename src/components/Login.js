import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../redux/actions'; // Router below
import { Redirect, Link } from 'react-router-dom'; // Redux above
import Navbar from './Navbar';

class Login extends Component {
	constructor(props) { // React boilerplate
		super(props);
		this.state = {
			username: '',
			password: ''
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) { // POST form data to /api/login
		e.preventDefault();
		const { username, password } = this.state;
		this.props.login({ username, password });
	}

	onChange({ target }) { this.setState({ [target.name]: target.value }); }

	// Define what the next page is to redirect to and redirect there if login succeeds
	render() {
		const { state, onSubmit, onChange, props } = this;
		const { token, username, match } = props;
		let { next, name } = match.params;
		let h1Text = 'Log in';
		switch (next) {
			case undefined: next = '/'; break;
			case 'PROFILE':
				next = `/${username}`; // Since it's now defined
				h1Text += ' to see your profile';
				break;
			case '/chats': h1Text += ' to see your chats'; break;
			default: // Not /, /chats, or PROFILE = it must be chat
				h1Text += ' to talk to ' + name;
		}
		if (!!token) return <Redirect to={next} />;

		return (<Fragment> {/* The GUI */}
			<Navbar />
			<div><Link to={{
				pathname: '/register',
				state: { next }
			}}>Register instead</Link></div>
			<h1>{h1Text}</h1>

			<form action="#" onSubmit={onSubmit}>
				<div> {/* Username */}
					<label htmlFor="id_username">Username</label>
					<input type="text" id="id_username" name="username"
						value={state.username} onChange={onChange} /></div>

				<div> {/* Password */}
					<label htmlFor="id_password">Password</label>
					<input type="password" id="id_password" name="password"
						value={state.password} onChange={onChange} /></div>

				<button type="submit">Login</button> {/* Redux login() */}
			</form>
		</Fragment>);
	}
}

Login.propTypes = { login: PropTypes.func.isRequired };
const mapStateToProps = state => ({
	token: state.data.token, username: state.data.token
});
export default connect(mapStateToProps, { login })(Login); // Attach redux