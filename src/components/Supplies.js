import React, { Fragment } from 'react';
import { MaskIcon, SanitizerIcon, PaperIcon, NoodlesIcon } from './Icons';

export const objWithAllSuppliesSetToFalse = {
	'Face masks': false,
	'Hand sanitizer': false,
	'Toilet paper': false,
	'Ramen noodles': false
};

export const arrWithAllSupplies =
	['Face masks', 'Hand sanitizer', 'Toilet paper', 'Ramen noodles'];

export function supplyArrFromObj(obj) { // return an array...
	const arr = [];
	for (let supply in obj) { // containing only the "true" supplies...
		if (!obj.hasOwnProperty(supply)) continue; // in this object...
		if (obj[supply]) arr.push(supply); // e.g. `"Hand sanitizer": true`
	}
	return arr;
}

export function supplyObjFromArr(arr) {
	const supplyObj = { ...objWithAllSuppliesSetToFalse };
	for (let i = 0; i < arr.length; i++) {
		supplyObj[arr[i]] = true;
	}
	return supplyObj;
}

export function SupplyIcon({ supply }) {
	let icon;
	switch (supply) {
		case 'Face masks': icon = <MaskIcon />; break;
		case 'Hand sanitizer': icon = <SanitizerIcon />; break;
		case 'Toilet paper': icon = <PaperIcon />; break;
		case 'Ramen noodles': icon = <NoodlesIcon />; break;
		default: // why, react?
	}
	const label = <span className="Icon-label">{supply}</span>;
	return <Fragment>{icon}{label}</Fragment>;
}

export function SupplyIconsList({ supplies }) {
	return (<ul className='Supply-icons-list'>{
		(supplies || []).map((supply, index) =>
			(<li key={index} title={supply}><SupplyIcon supply={supply} /></li>)
		)
	}</ul>);
}

export function CheckboxList({ id, supplyGroup, state, onChange }) {
	let checkboxes = [];
	for (let supply in objWithAllSuppliesSetToFalse) {
		if (!objWithAllSuppliesSetToFalse.hasOwnProperty(supply)) continue;
		const checked = state[supplyGroup][supply];
		const randomId = `a${Math.floor(Math.random() * Math.pow(10, 16))}`;
		checkboxes.push((<Fragment key={checkboxes.length}>
			<input type="checkbox" name={supplyGroup} data-supply={supply}
				id={randomId} checked={checked} onChange={onChange} />
			<label className={checked ? 'checked' : 'unchecked'}
				htmlFor={randomId}><SupplyIcon supply={supply} /></label>
		</Fragment>));
	}
	return <div id={id}>{checkboxes}</div>;
}