import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUsers } from '../actions/userActions';
import { Link } from 'react-router-dom';
import { Supplycons } from './supplyMethods';
import Me from '../static/icons/me.svg';

class PeopleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			group: 'have'
		};
		this.onGroupClick = this.onGroupClick.bind(this);
	}

	componentDidMount() { this.props.getUsers(); }

	onGroupClick() {
		this.setState({ group: this.state.group === 'need' ? 'have' : 'need' });
	}

	render() {
		const { group } = this.state;
		return (
			<Fragment>
				<Link to='/me' className='Me'>
					<img src={Me} alt='My profile' />
				</Link>

				<h3>
					<span>Talk to people who</span>
					<button onClick={this.onGroupClick}>{group}</button>
					<span>supplies:</span></h3>

				<ul>{
					this.props.allUsers.map((user, index) => {
						if (user[group].length === 0) return undefined;
						if (user.username === this.props.username) return undefined; // Don't show the user to himself. 
						return (
							<li key={index} className='Person-item'>
								<Link to={{ pathname: '/chat', state: { user } }}>
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

PeopleList.propTypes = { getUsers: PropTypes.func.isRequired };

const mapStateToProps = state => ({
	allUsers: state.user.allUsers,
	username: state.user.username
});

export default connect(mapStateToProps, { getUsers })(PeopleList);

/**
 * $
 * https://tylermcginnis.com/react-router-pass-props-to-link
 */