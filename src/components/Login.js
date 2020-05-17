import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../redux/actions';
// Redux up top, router down bottom
import { Redirect, Link } from 'react-router-dom';
import Navbar from './Navbar';

// React boilerplate
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

	// POST form data to /api/login
	onSubmit(e) {
		e.preventDefault();
		const { username, password } = this.state;
		this.props.login({ username, password });
	}

	// Make form inputs controlled
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

		// The GUI
		return (
			<Fragment>
				<Navbar />
				<div><Link to={{
					pathname: '/register',
					state: { next }
				}}>Register instead</Link></div>
				<h1>{h1Text}</h1>

				{/* Username */}
				<form action="#" onSubmit={onSubmit}>
					<div>
						<label htmlFor="id_username">Username</label>
						<input type="text" id="id_username" name="username"
							value={state.username} onChange={onChange} /></div>

					{/* Password */}
					<div>
						<label htmlFor="id_password">Password</label>
						<input type="password" id="id_password" name="password"
							value={state.password} onChange={onChange} /></div>

					{/* Redux login() */}
					<button type="submit">Login</button>
				</form>
			</Fragment>
		);
	}
}

// Attach redux to this component (get it – attach to `this`... component)
Login.propTypes = { login: PropTypes.func.isRequired };
const mapStateToProps = state => ({
	token: state.data.token, username: state.data.token
});
export default connect(mapStateToProps, { login })(Login);