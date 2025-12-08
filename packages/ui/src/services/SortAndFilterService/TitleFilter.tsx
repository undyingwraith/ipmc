import { computed, ReadonlySignal, Signal } from '@preact/signals-react';
import { inject } from 'inversify';
import { IFileInfo, isTitleFeature, type ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { SelectInput, TextInput } from '../../components/atoms';
import { IFilter } from './IFilter';

export class TitleFilter implements IFilter {
	constructor(
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
	) { }

	/**
	 * @inheritdoc
	 */
	public get name() {
		return 'Title';
	}

	/**
	 * @inheritdoc
	 */
	public apply<T extends IFileInfo>(list: ReadonlySignal<T[]>): ReadonlySignal<T[]> {
		return computed(() => {
			const q = this.query.value.toLowerCase();
			const m = this.mode.value;
			switch (m) {
				case 'contains':
					return list.value.filter(i => isTitleFeature(i) ? i.title.toLocaleLowerCase().includes(q) : i.name.toLowerCase().includes(q));
				case 'startsWith':
					return list.value.filter(i => isTitleFeature(i) ? i.title.toLowerCase().startsWith(q) : i.name.toLowerCase().startsWith(q));
			}
		});
	}

	/**
	 * @inheritdoc
	 */
	public render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', }}>
				<SelectInput
					value={this.mode}
					label={this.translate('Mode')}
					options={{
						'contains': this.translate('Contains'),
						'startsWith': this.translate('StartsWith')
					}}
				/>
				<TextInput
					value={this.query}
					label={this.translate('Query')}
				/>
			</div>
		);
	}

	private translate(key: string): ReadonlySignal<string> {
		return computed(() => this.translationService.language.value !== undefined ? this.translationService.translate(key) : 'Error');
	}

	private readonly mode = new Signal<TMode>('contains');
	private readonly query = new Signal<string>('');
}

type TMode = 'contains' | 'startsWith';
