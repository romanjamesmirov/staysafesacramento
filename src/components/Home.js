import React, { Component } from 'react';
import { connect } from 'react-redux'; // Redux
import PropTypes from 'prop-types';
import { getAllUsers } from '../redux/actions';
import { Link } from 'react-router-dom'; // Router
import { Supplycons } from './supplycon';

class Home extends Component {
	constructor(props) { // React boilerplate 
		super(props);
		this.state = { group: 'need' };
		this.onGroupClick = this.onGroupClick.bind(this);
	}

	componentDidMount() { // call for all users once per session
		if (!this.props.allUsers) return this.props.getAllUsers();
	}

	// 'have' or 'need' – which users are we displaying? 
	onGroupClick({ target }) { this.setState({ group: target.value }); }


	render() { // Destructuring helps in the long run. Think long term. 
		const { state, onGroupClick, props } = this;
		const { username, allUsers } = props;

		return (<main id="Home-page">
			{/* New user on home page – give them links to sign up or sign in */}
			{!!username ? undefined : <div id="Register-Login-links">
				<Link to='/register'>Register with StaySafeSacramento</Link>
				<div><hr /><p>or</p></div>
				<Link to='/login'>Log in</Link></div>}

			{/* Are we displaying users with at least one element in their 'have' or their 'need' array? */}
			<h2>Find people who...</h2>
			<div className="Filter-radio-button">
				<input id="Need-radio-button-input" type="radio"
					name="group" value="need"
					checked={state.group === 'need'} onChange={onGroupClick} />
				<label
					htmlFor="Need-radio-button-input">Need supplies</label>
			</div>
			<div className="Filter-radio-button">
				<input id="Have-radio-button-input" type="radio"
					name="group" value="have"
					checked={state.group === 'have'} onChange={onGroupClick} />
				<label
					htmlFor="Have-radio-button-input">Have supplies</label>
			</div>

			{/* Links to chat with users in the currently displayed group */}
			<ul id="All-users-list">{
				(allUsers || []).map((user, key) => {
					if (user[state.group].length === 0) return undefined;
					return (<li key={key}>
						<Link to={{ pathname: `/${user.username}`, state: { user } }}>
							<b className='Username'>{user.name}</b>
							{Supplycons(user[state.group])}
						</Link>
					</li>);
				})
			}</ul>
		</main>);
	}
}

// Connect redux to this component
Home.propTypes = { getAllUsers: PropTypes.func.isRequired };
const mapStateToProps = state => {
	const { allUsers, username } = state.data;
	return { allUsers, username };
};
export default connect(mapStateToProps, { getAllUsers })(Home);