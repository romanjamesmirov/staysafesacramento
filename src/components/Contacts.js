import React, { Component, Fragment } from 'react'; // react
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getContacts } from '../redux/actions'; // redux
import { Redirect, Link } from 'react-router-dom';
import Navbar from './Navbar'; // router
import Footer from './Footer';
import { Supplycons } from './supplycon.js'; // static

class Chats extends Component {
	constructor(props) { // boilerplate
		super(props);
		this.state = { group: 'need' };
	}

	componentDidMount() { // if first visit to this page...
		const { contacts, getContacts } = this.props;
		if (!contacts) getContacts(); // load contacts' data
	}

	// are we displaying the have's or have not's? 
	onGroupClick({ target }) { this.setState({ group: target.value }); }

	render() { 
		const { state, props, onGroupClick } = this;
		const { token, contacts } = props;
		if (!token) { // if unauthorized...
			return (<Redirect to={{ // redirect to login...
				pathname: '/login',
				state: { next: `/chats` } // and return back here after login
			}} />);
		}

		return (<Fragment> {/* GUI */}
			<Navbar />
			<h3>Show previous chats with people who...</h3>
			<div>  {/* display the have not's? */}
				<input id={'id_need'} type="radio" name="group" value="need"
					checked={state.group === 'need'} onChange={onGroupClick} />
				<label
					htmlFor="id_need}">Need supplies</label>
			</div>
			<div>  {/* display the have's? */}
				<input id={'id_have'} type="radio" name="group" value="have"
					checked={state.group === 'have'} onChange={onGroupClick} />
				<label
					htmlFor="id_have}">Have supplies</label>
			</div>
			<ul className="Contacts">{
				(contacts || []).map((contact, key) => { // map contact objects...
					if (contact[state.group].length === 0) return undefined;
					return (<li key={key}>  {/* to <li>'s */}
						<Link to={{ pathname: `/${contact.username}`, state: { contact } }}>
							<b className='Username'>{contact.name}</b>
							{Supplycons(contact[state.group])}
						</Link>
					</li>);
				})
			}</ul>
			<Footer />
		</Fragment>);
	}
}

Chats.propTypes = { getContacts: PropTypes.func.isRequired }; //⬇attach redux
const mapStateToProps = state => ({
	contacts: state.data.contacts,
	token: state.data.token
});
export default connect(mapStateToProps)(Chats); 