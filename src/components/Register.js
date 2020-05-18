import React, { Fragment, Component } from 'react'; 
import { connect } from 'react-redux'; // Redux
import PropTypes from 'prop-types';
import { register } from '../redux/actions';
import { Redirect, Link } from 'react-router-dom'; // Router
import Navbar from './Navbar';
import { checkboxList, allSuppliesSetToFalse, arrayWithSuppliesSetToTrue } from './supplycon'; // Static
import '../static/styles/Register.css';

class Register extends Component {
	constructor(props) { // React boilerplace
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

	onSubmit(e) { // POST form data formatted for /api/register
		e.preventDefault();
		const { name, username, password } = this.state;
		const have = arrWithSuppliesInGroup(this.state.have);
		const need = arrWithSuppliesInGroup(this.state.need);
		this.props.register({ name, username, password, have, need });
	}

	onChange({ target }) { // Make form elements controlled
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

		return (<Fragment> {/* The GUI */}
			<Navbar />
			<div><Link to={{
				pathname: '/register',
				state: { next }
			}}>Register instead</Link></div>
			<h1>{h1Text}</h1>
			<form action="#" onSubmit={onSubmit}>
				<div> {/* Name */}
					<label htmlFor="id_name">Name</label>
					<input type="text" id="id_name" name="name"
						value={state.name} onChange={onChange} /></div>
				<div> {/* User */}
					<label htmlFor="id_username">Username</label>
					<input type="text" id="id_username" name="username"
						value={state.username} onChange={onChange} /></div>
				<div> {/* Pass */}
					<label htmlFor="id_password">Password</label>
					<input type="password" id="id_password" name="password"
						value={state.password} onChange={onChange} /></div>
				<h3>I have...</h3>
				<div>{checkboxList('have', this)}</div> {/* Have */}
				<h3>I need...</h3>
				<div>{checkboxList('need', this)}</div> {/* Need */}
				<button type="submit">Register</button>
			</form>
		</Fragment>);
	}
}

Register.propTypes = { register: PropTypes.func.isRequired };
const mapStateToProps = state => ({
	token: state.data.token, username: state.data.token
}); // Attach redux 
export default connect(mapStateToProps, { register })(Register);