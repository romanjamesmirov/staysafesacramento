import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Supplycons } from './supplycon';
import Me from '../static/icons/me.svg';

class PeopleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			group: 'have'
		};
		this.onGroupClick = this.onGroupClick.bind(this);
	}

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
						if (user[group].length === 0 || user.username === this.props.username) {
							return undefined;
						} // Filter by group and don't show the user to themselves.
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

const mapStateToProps = state => ({
	allUsers: state.user.allUsers,
	username: state.user.username
});

export default connect(mapStateToProps)(PeopleList);

//$ https://tylermcginnis.com/react-router-pass-props-to-link