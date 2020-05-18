import React, { Component, Fragment } from 'react'; // react
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getContacts } from '../redux/actions'; // redux
import { Redirect } from 'react-router-dom';
import Navbar from './Navbar'; // router
import Footer from './Footer';
import { Supplycons } from './supplycon.js'; // static

class Chats extends Component {
	constructor(props) { // React boilerplate
		super(props);
		this.state = { group: 'need' };
	}

	// If this is the first time visiting this page, load contact user info 
	componentDidMount() {
		if (!this.props.contacts) this.props.getContacts();
	}

	// 'have' or 'need' – which users are we displaying? 
	onGroupClick({ target }) { this.setState({ group: target.value }); }

	render() { // The GUI
		const { token, contacts } = this.props;
		if (!token) {
			return (<Redirect to={{
				pathname: '/login',
				state: { next: `/chats` }
			}} />);
		}
		return (<Fragment>
			<Navbar />

			{/* Are we displaying users with at least one element in their 'have' or their 'need' array? */}
			<h3>Show previous chats with people who...</h3>
			<div>
				<input id={'id_need'} type="radio" name="group" value="need"
					checked={state.group === 'need'} onChange={onGroupClick} />
				<label
					htmlFor="id_need}">Need supplies</label>
			</div>
			<div>
				<input id={'id_have'} type="radio" name="group" value="have"
					checked={state.group === 'have'} onChange={onGroupClick} />
				<label
					htmlFor="id_have}">Have supplies</label>
			</div>

			{/* Map array of contact objects into li's */}
			<ul className="Contacts">{
				(contacts || []).map((contact, key) => {
					if (contact[state.group].length === 0) return undefined;
					return (<li key={key}>
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

// Attach redux to this component
Chats.propTypes = { getContacts: PropTypes.func.isRequired };
const mapStateToProps = state => ({
	contacts: state.data.contacts,
	token: state.data.token
});
export default connect(mapStateToProps)(Chats);