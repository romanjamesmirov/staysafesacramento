import React from 'react'
import MaskIcon from '../static/icons/face-mask.svg'
import SanitizerIcon from '../static/icons/hand-sanitizer.svg'
import PaperIcon from '../static/icons/toilet-paper.svg'
import NoodlesIcon from '../static/icons/ramen.svg'

// <div>Hand sanitizer, toilet paper, ramen noodles, and user icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// <div>Face mask icon made by <a href="https://www.flaticon.com/authors/linector" title="Linector">Linector</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// <div>Profile icon made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
export default function Supplycons(supplies) {
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
						<img src={icon} alt={supply} />
						<span className='Icon-label'>{supply}</span></li>
				)
			})}
		</ul>
	)
}