import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authRegister } from '../actions'; //!
import { Redirect, Link } from 'react-router-dom';
import { checkboxList, allSuppliesObj, objToArr } from './supplycon';
import '../static/styles/Register.css';

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			username: '',
			password: '',
			have: { ...allSuppliesObj },
			need: { ...allSuppliesObj }
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		const { name, username, password, have, need } = this.state;
		this.props.authRegister(
			{ name, username, password, have: objToArr(have), need: objToArr(need) }
		);
	}

	onChange({ target }) {
		let { value } = target;
		if (target.type === 'checkbox') {
			const supply = target.id.split('_').slice(2).join(' ');
			value = { ...this.state[target.name] };
			value[supply] = target.checked;
		}
		this.setState({ [target.name]: value });
	}

	render() {
		if (this.props.token !== '') return <Redirect to='/' />; //@ 

		return (
			<Fragment>
				<div>
					<Link to='/'>X</Link>
					<Link to='/login'>Login</Link>
				</div>
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
					<p>I have...</p>
					<div>{checkboxList('have', this)}</div>
					<p>I need...</p>
					<div>{checkboxList('need', this)}</div>
					<button type="submit">Register</button>
				</form>
			</Fragment>
		);
	}
}

Register.propTypes = { authRegister: PropTypes.func.isRequired };
const mapStateToProps = state => ({ token: state.data.token });
export default connect(mapStateToProps, { authRegister })(Register);

//! https://www.freecodecamp.org/news/redux-get-the-ball-rolling-in-10min-9d9551ff4b3c/ I get it now. Reducers are the middleman between state and actions. Actions have the goal of changing state, like setState. But the store is read-only. Neither actions nor reducers update state. Instead, reducers return a new state based on the current state and the action's payload. So the app isn't based on state. It's based on the reducers. 

//@. https://tylermcginnis.com/react-router-programmatically-navigate/ I just combined it with redux. If login or registration is successful, I call the REDIRECT dispatch type in userReducers.