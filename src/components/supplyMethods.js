import React from 'react';
import MaskIcon from '../static/icons/face-mask.svg';
import SanitizerIcon from '../static/icons/hand-sanitizer.svg';
import PaperIcon from '../static/icons/toilet-paper.svg';
import NoodlesIcon from '../static/icons/ramen.svg';

export const allSuppliesObj = {
	'Face masks': false,
	'Hand sanitizer': false,
	'Toilet paper': false,
	'Ramen noodles': false
};

export const allSuppliesArr = ['Face masks', 'Hand sanitizer', 'Toilet paper', 'Ramen noodles'];

export function objToArr(obj) {
	let arr = [];
	for (let supply in obj) {
		if (!obj.hasOwnProperty(supply)) continue;
		if (obj[supply]) arr.push(supply);
	}
	return arr;
}

export function arrToObj(arr) {
	let obj = { ...allSuppliesObj };
	arr.forEach(supply => obj[supply] = true);
	return obj;
}

// <div>Hand sanitizer, toilet paper, ramen noodles, and user icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// <div>Face mask icon made by <a href="https://www.flaticon.com/authors/linector" title="Linector">Linector</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// <div>Profile icon made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
export function Supplycons(supplies) {
	return (
		<ul className='Supplycon-list'>
			{supplies.map((supply, index) => {
				return (
					<li key={index} className='Supplycon-item' title={supply}>
						{Supplycon(supply)}
						<span className='Icon-label'>{supply}</span></li>
				);
			})}
		</ul>
	)
}

export function Supplycon(supply) {
	let icon;
	switch (supply) {
		case 'Face masks': icon = MaskIcon; break;
		case 'Hand sanitizer': icon = SanitizerIcon; break;
		case 'Toilet paper': icon = PaperIcon; break;
		default: icon = NoodlesIcon;
	}
	return <img src={icon} alt={supply} />
}