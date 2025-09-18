import { TextField } from '@mui/material';
import { computed, ReadonlySignal, Signal } from '@preact/signals-react';
import { injectable } from 'inversify';
import { IFileInfo, isYearFeature } from 'ipmc-interfaces';
import React from 'react';
import { IFilter } from './IFilter';

@injectable()
export class YearFilter implements IFilter {
	render() {
		return (
			<div>
				YearFilter
				{computed(() => (
					<TextField
						label={'Start'}
						type={'number'}
						value={this.startYear.value}
						onChange={ev => this.startYear.value = parseInt(ev.target.value)}
					/>
				))}
				{computed(() => (
					<TextField
						label={'End'}
						type={'number'}
						value={this.endYear.value}
						onChange={ev => this.endYear.value = parseInt(ev.target.value)}
					/>
				))}
			</div>
		);
	}

	public apply<T extends IFileInfo>(list: ReadonlySignal<T[]>): ReadonlySignal<T[]> {
		return computed(() => list.value.filter(item => {
			if (isYearFeature(item)) {
				if (this.startYear.value !== undefined && this.startYear.value >= item.year) {
					return false;
				}
				if (this.endYear.value !== undefined && this.endYear.value <= item.year) {
					return false;
				}
				return true;
			}

			return this.includeMissing.value;
		}));
	}

	public name = 'Year';

	private startYear = new Signal<number | undefined>(undefined);
	private endYear = new Signal<number | undefined>(undefined);
	private includeMissing = new Signal<boolean>(false);
}
