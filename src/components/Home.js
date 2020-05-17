import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../redux/actions';
// Redux up top, router down bottom
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Supplycons } from './supplycon';

// React boilerplate 
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { group: 'need' };
		this.onGroupClick = this.onGroupClick.bind(this);
	}

	// allUsers is always up-to-date with the server when you visit the home screen, but we only call for the entire array from the server ONCE per session... :)
	componentDidMount() {
		if (!this.props.allUsers) return this.props.getAllUsers();
	}

	// 'have' or 'need' – which users are we displaying? 
	onGroupClick({ target }) { this.setState({ group: target.value }); }

	// Destructuring helps in the long run. Think long term. 
	render() {
		const { state, onGroupClick, props } = this;
		const { username, allUsers } = props;

		// Links to other pages
		return (<Fragment>
			<Navbar />
			{!!username ? undefined : <div className="Register-or-log-in">
				<Link to='/register'>Register with us!</Link>
				<Link to='/login'>Or log in</Link>
			</div>}

			{/* Are we displaying users with at least one element in their 'have' or their 'need' array? */}
			<h3>Find people who...</h3>
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

			{/* Links to chat with users in the currently displayed group */}
			<ul className="All-users">{
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
		</Fragment>);
	}
}

// Connect redux to this component
Home.propTypes = { getAllUsers: PropTypes.func.isRequired };
const mapStateToProps = state => {
	const { allUsers, username } = state.data;
	return { allUsers, username };
};
export default connect(mapStateToProps, { getAllUsers })(Home);

// RESOURCES
// #R1 – <Link>'s with props – tylermcginnis.com/react-router-pass-props-to-link
// #R2 – mapState – react-redux.js.org/using-react-redux/connect-mapstate