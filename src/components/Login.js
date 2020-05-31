import React, { Component } from 'react'; // redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../redux/actions';
import { Redirect, Link } from 'react-router-dom'; // router

class Login extends Component {
	constructor(props) { // React boilerplate
		super(props);
		this.state = {
			username: '',
			password: '',
			errorMsg: ''
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	async onSubmit(e) { // POST form data to /api/login
		e.preventDefault();
		const { username, password } = this.state;
		const login = await this.props.login({ username, password }, 'login');
		if (login instanceof Error) this.setState({ errorMsg: login.message });
	}

	onChange({ target }) { this.setState({ [target.name]: target.value }); }

	// Define what the next page is to redirect to and redirect there if login succeeds
	render() {
		let next = this.props.location.state ? this.props.location.state.next : '/';
		if (this.props.token && next !== 'PROFILE') return <Redirect to={next} />;
		if (next === 'PROFILE') return <Redirect to={`/${this.props.username}`} />;
		const { username, password, errorMsg } = this.state;
		const { onSubmit, onChange } = this;

		return (<main id="Login-page">
			<div id="Login-h1-and-register-link">
				<h1>Log in</h1>
				<Link to={{ pathname: '/register', state: { next } }}>
					Register instead</Link></div>

			<form action="#" onSubmit={onSubmit}>
				<input type="text" name="username" placeholder="Username"
					value={username} onChange={onChange} />
				<input type="password" name="password" placeholder="Password"
					value={password} onChange={onChange} />

				{!errorMsg ? undefined :
					<div className="Error-message">{errorMsg}</div>}

				<button type="submit">Login</button>
			</form>
		</main>);
	}
}

Login.propTypes = { login: PropTypes.func.isRequired };
const mapStateToProps = ({ data }) => ({
	token: data.token, username: data.token
});
export default connect(mapStateToProps, { login })(Login); // Attach redux