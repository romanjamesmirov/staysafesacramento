import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../redux/actions';
// Redux up top, router & static content down bottom.
import { Redirect, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { checkboxList, allSuppliesSetToFalse, arrayWithSuppliesSetToTrue } from './supplycon';
import '../static/styles/Register.css';

// React boilerplate
class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			username: '',
			password: '',
			have: { ...allSuppliesSetToFalse },
			need: { ...allSuppliesSetToFalse }
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	// POST form data formatted for /api/register
	onSubmit(e) {
		e.preventDefault();
		const { name, username, password } = this.state;
		const have = arrWithSuppliesInGroup(this.state.have);
		const need = arrWithSuppliesInGroup(this.state.need);
		this.props.register({ name, username, password, have, need });
	}

	// Make form elements controlled
	onChange({ target }) {
		let { value, name } = target;
		if (target.type === 'checkbox') {
			// 'id_have_Face_masks' becomes 'Face masks'
			const supply = target.id.split('_').slice(2).join(' ');
			value = { ...this.state[name] };
			value[supply] = target.checked;
		}
		this.setState({ [name]: value });
	}

	// Define what the next page is to redirect to and redirect there if registration succeeded
	render() {
		const { state, onSubmit, onChange, props } = this;
		const { token, username, match } = props;
		let { next, name } = match.params;
		let h1Text = 'Register with StaySafeSacramento';
		switch (next) {
			case undefined: next = '/'; break;
			case 'PROFILE':
				next = `/${username}`; // Since it's now defined
				h1Text = 'Create your StaySafeSacramento profile';
				break;
			case '/chats': h1Text += ' and help others find you'; break;
			default: // Not /, /chats, or PROFILE = it must be chat
				h1Text += ' to talk to ' + name;
		}
		if (!!token) return <Redirect to={next} />;

		// The GUI
		return (<Fragment>
			<Navbar />
			<div><Link to={{
				pathname: '/register',
				state: { next }
			}}>Register instead</Link></div>
			<h1>{h1Text}</h1>
			<form action="#" onSubmit={onSubmit}>
				<div>
					<label htmlFor="id_name">Name</label>
					<input type="text" id="id_name" name="name"
						value={state.name} onChange={onChange} /></div>
				<div>
					<label htmlFor="id_username">Username</label>
					<input type="text" id="id_username" name="username"
						value={state.username} onChange={onChange} /></div>
				<div>
					<label htmlFor="id_password">Password</label>
					<input type="password" id="id_password" name="password"
						value={state.password} onChange={onChange} /></div>
				<h3>I have...</h3>
				<div>{checkboxList('have', this)}</div>
				<h3>I need...</h3>
				<div>{checkboxList('need', this)}</div>
				<button type="submit">Register</button>
			</form>
		</Fragment>);
	}
}

// Attach redux to this component
Register.propTypes = { register: PropTypes.func.isRequired };
const mapStateToProps = state => ({
	token: state.data.token, username: state.data.token
});
export default connect(mapStateToProps, { register })(Register);

// RESOURCES
// #R1 – I get it now. Reducers are the middleman between state and actions. Actions have the goal of changing state, like setState. But the store is read-only. Neither actions nor reducers update state. Instead, reducers return a new state based on the current state and the action's payload. So the app isn't based on state. It's based on the reducers. freecodecamp.org/news/9d9551ff4b3c
// #R2 – Conditional redirect in render() – tylermcginnis.com/react-router-programmatically-navigate – I just combined it with redux. 