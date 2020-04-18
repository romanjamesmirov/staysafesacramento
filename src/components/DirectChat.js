import React, { Fragment, Component } from 'react'
import Supplycons from './Supplycons'

export default class DirectChat extends Component {
	constructor(props) {
		super(props)
		this.state = {
			person: null
		}
	}

	render() {
		const { person } = this.props.location.state
		return (
			<Fragment>
				<h1>{person.name}</h1>
				{Supplycons(person.has)}
			</Fragment>
		)
	}
}