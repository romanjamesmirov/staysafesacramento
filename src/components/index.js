import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import { fetchAllUsers } from '../redux/actions';
import { Link } from 'react-router-dom';
import { Supplycons } from './supplycon';
import Me from '../static/icons/me.svg';

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = { group: 'need' };
		this.onGroupClick = this.onGroupClick.bind(this);
	}

	componentDidMount() {
		if (!this.props.fetchedAllUsers) this.props.fetchAllUsers();
	}

	onGroupClick({ target }) { this.setState({ group: target.value }); }

	render() {
		const { group } = this.state;
		return (
			<Fragment>
				<Link to='/me' className='Me'><img src={Me} alt='My profile' /></Link>
				<div>{radioButton('need', this)}{radioButton('have', this)}</div>
				<ul>{
					this.props.allUsers.map((user, index) => {
						if (user[group].length === 0 || user.username === this.props.username) return undefined; // Filter by group and don't show the user to themselves.
						return (
							<li key={index} className='Person-item'>
								<Link to={{ pathname: `/${user.username}`, state: { user } }}>
									<span className='Person-name'>{user.name}</span>
									{Supplycons(user[group])}
								</Link>
							</li>
						); //$
					})
				}</ul>
			</Fragment>
		);
	}
}

function radioButton(group, that) {
	return (<div>
		<input id={`id_${group}`} type="radio" name="group" value={group}
			checked={that.state.group === group} onChange={that.onGroupClick} />
		<label htmlFor={`id_${group}`}>Show people who {group} supplies</label>
	</div>);
}

Users.propTypes = { fetchAllUsers: PropTypes.func.isRequired };
const mapStateToProps = state => ({ //%
	allUsers: state.data.allUsers,
	fetchedAllUsers: state.data.fetchedAllUsers,
	username: state.data.username
});
export default connect(mapStateToProps, { fetchAllUsers })(Users); 

//$ tylermcginnis.com/react-router-pass-props-to-link
//% react-redux.js.org/using-react-redux/connect-mapstate