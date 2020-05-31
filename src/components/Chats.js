import React, { Component } from 'react'; // react
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom'; // router
import { SupplyIconsList } from './Supplies.js'; // static

class Chats extends Component {
	constructor(props) {
		super(props);
		this.state = { group: 'need', contacts: [] };
		this.onGroupClick = this.onGroupClick.bind(this);
	}

	async componentDidMount() {
		const { contacts } = this.props;
		if (!contacts) return;
		const ids = [];
		for (let i = 0; i < contacts.length; i++) {
			ids[i] = contacts[i].contact_id;
		}
		try { // query params = just give me these users
			const res = await fetch(`/api/users?ids=${ids.join(',')}`);
			if (res.status !== 200) throw new Error('Could not retrieve contacts');
			res.json().then(contacts => this.setState({ contacts }));
		} catch (error) { this.setState({ errorMessage: error.message }); }
	}

	// are we displaying the haves or the have nots? 
	onGroupClick({ target }) { this.setState({ group: target.value }); }

	render() {
		if (!this.props.token) { // if unauthorized, log in and come back
			const next = '/chats';
			return <Redirect to={{ pathname: '/login', state: { next } }} />;
		}
		const { group, contacts, errorMessage } = this.state;
		const { onGroupClick } = this;
		const genRandomId = () => Math.floor(Math.random() * Math.pow(10, 16));
		const randomIds = [genRandomId(), genRandomId()];

		return (<main>
			<div className="Filter-by-supply-group">
				<h2>Show contacts who...</h2>
				<div>
					<input id={randomIds[0]} type="radio" name="group" value="need"
						checked={group === 'need'} onChange={onGroupClick} />
					<label htmlFor={randomIds[0]}>Need supplies</label>
					<input id={randomIds[1]} type="radio" name="group" value="have"
						checked={group === 'have'} onChange={onGroupClick} />
					<label htmlFor={randomIds[1]}>Have supplies</label>
				</div>
			</div>

			{!errorMessage ? undefined :
				<div className="Error-message">
					<p>Could not retrieve profiles</p>
					<p>Click the Home icon to try again</p></div>}

			<ul id="Contacts-list">{
				contacts.map((contact, key) => {
					if (contact[group].length === 0) return undefined;
					return (<li key={key}>
						<Link to={{ pathname: `/${contact.username}`, state: { contact } }}>
							<b className='Username'>{contact.name}</b>
							{SupplyIconsList(contact[group])}
						</Link>
					</li>);
				})
			}</ul>
		</main>);
	}
}

const mapStateToProps = ({ data }) => ({
	contacts: data.contacts,
	token: data.token
});
export default connect(mapStateToProps)(Chats); 