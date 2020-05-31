import React, { Component } from 'react';
import { connect } from 'react-redux'; // Redux
import PropTypes from 'prop-types';
import { register } from '../redux/actions';
import { Redirect, Link } from 'react-router-dom'; // Router
import { CheckboxList, objWithAllSuppliesSetToFalse, supplyArrFromObj } from './Supplies'; // Static

class Register extends Component {
	constructor(props) { // React boilerplace
		super(props);
		this.state = {
			name: '',
			username: '',
			password: '',
			have: { ...objWithAllSuppliesSetToFalse },
			need: { ...objWithAllSuppliesSetToFalse }
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	async onSubmit(e) { // POST form data formatted for /api/register
		e.preventDefault();
		const { name, username, password } = this.state;
		const have = supplyArrFromObj(this.state.have);
		const need = supplyArrFromObj(this.state.need);
		await this.props.register({ name, username, password, have, need });
	}

	onChange({ target }) { // match state with current input values
		let { name, value, type, checked } = target;
		if (type !== 'checkbox') return this.setState({ [name]: value });
		const newGroupState = { ...this.state[name] };
		const supply = target.getAttribute('data-supply');
		newGroupState[supply] = checked;
		this.setState({ [name]: newGroupState });
	}

	render() { // redirect to where user wanted to go on successful registration
		let next = this.props.location.state ? this.props.location.state.next : '/';
		if (this.props.token && next !== 'PROFILE') return <Redirect to={next} />;
		if (next === 'PROFILE') return <Redirect to={`/${this.props.username}`} />;
		const { name, username, password } = this.state;
		const { onSubmit, onChange } = this;

		return (<main id="Register-page">
			<div id="Register-h1-and-login-link">
				<h1>Register</h1>
				<Link to={{ pathname: '/login', state: { next } }}>
					Log in instead</Link></div>

			<form action="#" onSubmit={onSubmit}>
				<input type="text" name="name" placeholder="Name"
					value={name} onChange={onChange} />

				<input type="text" name="username" placeholder="Username"
					value={username} onChange={onChange} />

				<input type="password" name="password" placeholder="Password"
					value={password} onChange={onChange} />

				<h3>I have...</h3>
				<CheckboxList id="Register-form-have-supplies" supplyGroup="have"
					state={this.state} onChange={this.onChange} />

				<h3>I need...</h3>
				<CheckboxList id="Register-form-need-supplies" supplyGroup="need"
					state={this.state} onChange={this.onChange} />

				<button type="submit">Register</button>
			</form>
		</main>);
	}
}

Register.propTypes = { register: PropTypes.func.isRequired };
const mapStateToProps = ({ data }) => ({
	token: data.token, username: data.token
});
export default connect(mapStateToProps, { register })(Register);