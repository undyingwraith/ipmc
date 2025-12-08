import { computed, ReadonlySignal, Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { IFileInfo, isYearFeature, type ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { NumberInput } from '../../components/atoms';
import { IFilter } from './IFilter';

@injectable()
export class YearFilter implements IFilter {
	constructor(
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
	) { }

	private translate(key: string): ReadonlySignal<string> {
		return computed(() => this.translationService.language.value !== undefined ? this.translationService.translate(key) : 'Error');
	}

	public render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<NumberInput
					value={this.startYear}
					label={this.translate('Since')}
				/>
				<NumberInput
					value={this.endYear}
					label={this.translate('Until')}
				/>
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
