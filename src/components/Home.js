import React, { Component } from 'react';
import { connect } from 'react-redux'; // Redux
import { Link } from 'react-router-dom'; // Router
import { SupplyIconsList } from './Supplies';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { group: 'need', users: [] };
		this.onGroupClick = this.onGroupClick.bind(this);
	}

	async componentDidMount() {
		try {
			const res = await fetch('/api/users'); // no query params = all users
			if (res.status !== 200) throw new Error('Could not get users');
			res.json().then(users => this.setState({ users }));
		} catch (error) { this.setState({ errorMessage: error.message }); }
	}

	// display the haves or the have nots? 
	onGroupClick({ target }) { this.setState({ group: target.value }); }


	render() { // Destructuring helps in the long run. Think long term. 
		const { username } = this.props;
		const { group, users, errorMessage } = this.state;
		const { onGroupClick } = this;
		const genRandomId = () => Math.floor(Math.random() * Math.pow(10, 16));
		const randomIds = [genRandomId(), genRandomId()];

		return (<main id="Home-page">
			{!!username ? undefined : <div id="Register-Login-links">
				<Link to='/register'>Register with StaySafeSacramento</Link>
				<div><hr /><p>or</p></div>
				<Link to='/login'>Log in</Link></div>}

			<div className="Filter-by-supply-group">
				<h2>Find people who...</h2>
				<div>
					<input id={randomIds[0]} type="radio"	name="group" value="need"
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

			<ul id="All-users-list">{
				users.map((user, key) => {
					if (user[group].length === 0) return undefined;
					if (user.username === username) return undefined;
					return (<li key={key}>
						<Link to={{ pathname: `/${user.username}`, state: { user } }}>
							<b className='Username'>{user.name}</b>
							<SupplyIconsList supplies={user[group]} />
						</Link>
					</li>);
				})
			}</ul>
		</main>);
	}
}

const mapStateToProps = ({ data }) => ({ username: data.username });
export default connect(mapStateToProps)(Home);