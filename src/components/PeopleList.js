import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom'
import Supplycons from './Supplycons'
import Me from '../static/icons/me.svg'

const people = [
	{ name: 'John D.', has: ['Ramen noodles'], needs: [] },
	{ name: 'Grant H.', has: [], needs: ['Toilet paper'] },
	{ name: 'Hugh J.', has: [], needs: ['Hand sanitizer'] },
	{ name: 'Bob F.', has: ['Toilet paper'], needs: [] },
	{ name: 'Kelly S.', has: ['Hand sanitizer', 'Face masks'], needs: [] },
	{ name: 'Fred W.', has: ['Hand sanitizer'], needs: ['Toilet paper'] },
	{ name: 'Bill B.', has: [], needs: ['Face masks'] },
	{ name: 'Walt D.', has: [], needs: ['Ramen noodles', 'Hand sanitizer'] },
	{ name: 'Stanley L.', has: ['Toilet paper'], needs: [] },
	{ name: 'Lisa M.', has: [], needs: ['Toilet paper'] },
]

export default class PeopleList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showing: 'has'
		}
		this.onShowingClick = this.onShowingClick.bind(this)
	}

	onShowingClick() {
		if (this.state.showing === 'has') this.setState({ showing: 'needs' })
		else this.setState({ showing: 'has' })
	}

	render() {
		const { showing } = this.state
		return (
			<Fragment>
				<Link to='/me' className='Me'>
					<img src={Me} alt='My profile' />
					<span className='Icon-label'>Me</span>
				</Link>

				<h3>
					<span>Show people who</span>
					<button onClick={this.onShowingClick}>{showing === 'has' ? 'have' : 'need'}</button>
					<span>supplies:</span></h3>

				<ul>
					{people.map((person, index) => {
						if (person[showing].length === 0) return undefined
						return (
							<li key={index} className='Person-item'>
								<Link to={{ pathname: '/chat', state: { person } }}> {/* 1 */}
									<span className='Person-name'>{person.name}</span>
									{Supplycons(person[showing])}
								</Link>
							</li>)
					})}
				</ul>
			</Fragment>
		)
	}
}

/**
 * 1: tylermcginnis.com/react-router-pass-props-to-link
 */