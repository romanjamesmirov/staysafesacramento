import React, { Fragment, Component } from 'react'
import './static/styles/App.css'
import MaskIcon from './static/icons/face-mask-1.svg'
import SanitizerIcon from './static/icons/hand-sanitizer-1.svg'
import PaperIcon from './static/icons/toilet-paper.svg'
import NoodlesIcon from './static/icons/ramen-1.svg'

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

export default class App extends Component {
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
        <h3>
          <span>Show people who</span>
          <button onClick={this.onShowingClick}>{showing === 'has' ? 'have' : 'need'}</button>
          <span>supplies:</span></h3>
        
        <ul>
          {people.map((person, index) => {
            if (person[showing].length === 0) return undefined
            return (
              <li key={index} className='Person-item'>
                <button>
                  <span className='Person-name'>{person.name}</span>
                  {supplycons(person[showing])}
                </button>
              </li>)})}
        </ul>
      </Fragment>
    )
  }
}

// SANITIZER, RAMEN, MASK, SANITIZER (1), RAMEN (1), TOILET PAPER: <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// FACE MASK (1): <div>Icons made by <a href="https://www.flaticon.com/authors/linector" title="Linector">Linector</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
function supplycons(supplies) {
  return (
    <ul className='Supplycon-list'>
      {supplies.map((supply, index) => {
        let icon
        switch (supply) {
          case 'Face masks': icon = MaskIcon; break
          case 'Hand sanitizer': icon = SanitizerIcon; break
          case 'Toilet paper': icon = PaperIcon; break
          default: icon = NoodlesIcon
        }
        return (
          <li key={index} className='Supplycon-item' title={supply}>
            <img src={icon} alt={supply} /></li>
        )
      })}
    </ul>
  )
}