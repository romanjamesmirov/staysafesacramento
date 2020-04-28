import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setUser } from '../actions/userActions';
import { Redirect } from 'react-router-dom';
import { Supplycon, allSuppliesObj, objToArr } from './supplyMethods';
import '../static/styles/Register.css';

/* 

https://www.freecodecamp.org/news/redux-get-the-ball-rolling-in-10min-9d9551ff4b3c/ 

i get it now. reducers are the middleman between state and actions which have the goal of changing state. reducers take the current state and return a new one. that way you never actually touch the current/previous state and therefore they call it immutable/read-only. so the app isn't based on the original state object (store?). it's based on the reducers. 

*/

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			username: '',
			password: '',
			have: { ...allSuppliesObj },
			need: { ...allSuppliesObj },
			toPeopleList: false //1
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		const { name, username, password, have, need } = this.state;
		this.props.setUser(
			{ name, username, password, have: objToArr(have), need: objToArr(need) }
		);
		this.setState({ toPeopleList: true });
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
		if (this.state.toPeopleList) return <Redirect to='/' />;

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

					<p>I have...</p>
					<div>{checkboxList('have', this.state, this.onChange)}</div>

					<p>I need...</p>
					<div>{checkboxList('need', this.state, this.onChange)}</div>

					<button type="submit">Register</button>
				</form>
			</Fragment>
		);
	}
}

Register.propTypes = { setUser: PropTypes.func.isRequired };

export default connect(null, { setUser })(Register);

function checkboxList(group, state, onChange) { // group === 'have' or 'need'
	let checkboxes = [];
	for (let supply in allSuppliesObj) {
		if (!allSuppliesObj.hasOwnProperty(supply)) continue;
		const id = `id_${group}_${supply.split(' ').join('_')}`;
		const checked = state[group][supply];
		checkboxes.push((
			<Fragment key={checkboxes.length}>
				<label className={checked ? 'checked' : 'unchecked'} htmlFor={id}>{Supplycon(supply)}</label>
				<input type="checkbox" id={id} name={group}
					checked={checked} onChange={onChange} />
			</Fragment>
		));
	}
	return checkboxes;
}

//1. https://tylermcginnis.com/react-router-programmatically-navigate/