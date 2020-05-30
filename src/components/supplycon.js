import React, { Fragment } from 'react';
import { MaskIcon, SanitizerIcon, PaperIcon, NoodlesIcon } from './Icons';

export const allSuppliesSetToFalse = {
	'Face masks': false,
	'Hand sanitizer': false,
	'Toilet paper': false,
	'Ramen noodles': false
};

export const arrayWithAllSupplies = ['Face masks', 'Hand sanitizer', 'Toilet paper', 'Ramen noodles'];

export function arrWithOnlyTrueSupplies(obj) { // return an array...
	const arr = [];
	for (let supply in obj) { // containing only the "true" supplies...
		if (!obj.hasOwnProperty(supply)) continue; // in this object...
		if (obj[supply]) arr.push(supply); // e.g. `"Hand sanitizer": true`
	}
	return arr;
}

export function arrToObj(arr) {
	let obj = { ...allSuppliesSetToFalse };
	arr.forEach(supply => obj[supply] = true);
	return obj;
}

export function Supplycons(supplies) {
	return (
		<ul className='Supplycon-list'>{
			(supplies || []).map((supply, index) => {
				return (
					<li key={index} className='Supplycon-item' title={supply}>
						<SupplyIcon supply={supply} />
						<span className='Icon-label'>{supply}</span></li>
				);
			})
		}</ul>
	);
}

export function checkboxList(group, that) { // group === 'have' or 'need'
	let checkboxes = [];
	for (let supply in allSuppliesSetToFalse) {
		if (!allSuppliesSetToFalse.hasOwnProperty(supply)) continue;
		const id = `id_${group}_${supply.split(' ').join('_')}`;
		const checked = that.state[group][supply];
		checkboxes.push((
			<Fragment key={checkboxes.length}>
				<label className={checked ? 'checked' : 'unchecked'} htmlFor={id}><SupplyIcon supply={supply} /></label>
				<input type="checkbox" id={id} name={group}
					checked={checked} onChange={that.onChange} />
			</Fragment>
		));
	}
	return checkboxes;
}

export function SupplyIcon({ supply }) {
	switch (supply) {
		case 'Face masks': return <MaskIcon />
		case 'Hand sanitizer': return <SanitizerIcon />
		case 'Toilet paper': return <PaperIcon />
		case 'Ramen noodles': return <NoodlesIcon />
		default:
	}
}