import { Checkbox, FormControlLabel } from '@mui/material';
import { computed, ReadonlySignal, Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { IFileInfo, type IIndexManager, IIndexManagerSymbol, isIVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { ErrorBoundary } from '../../components/molecules';
import { IFilter } from './IFilter';

@injectable()
export class LanguageFilter implements IFilter {
	constructor(
		@inject(IIndexManagerSymbol) private readonly indexManager: IIndexManager,
	) { }

	get name() {
		return 'Language';
	}

	apply<T extends IFileInfo>(list: ReadonlySignal<T[]>): ReadonlySignal<T[]> {
		return computed(() => {
			const selected = this.selectedLanguages.value;
			return list.value.filter((item) => {
				if (isIVideoFile(item) && item.languages.some(l => selected.includes(l))) {
					return true;
				}

				return false;
			});
		});
	}

	render() {
		return (
			<div>
				{computed(() => {
					const selected = this.selectedLanguages.value;
					const langs = this.availableLanguages.value;

					return langs.map((l) => (
						<ErrorBoundary>
							<FormControlLabel
								control={(
									<Checkbox
										checked={selected.includes(l)}
										onChange={() => {
											if (selected.includes(l)) {
												this.selectedLanguages.value = selected.filter(ll => ll !== l);
											} else {
												this.selectedLanguages.value = [...selected, l];
											}
										}}
									/>
								)}
								label={l}
							/>
						</ErrorBoundary>
					));
				})}
			</div>
		);
	}

	private readonly selectedLanguages = new Signal<string[]>([]);
	private readonly availableLanguages = computed(() => {
		const languages = new Set<string>();
		this.indexManager.indexes.forEach((idx) => {
			idx.value?.index.forEach(item => {
				if (isIVideoFile(item)) {
					item.languages.forEach(l => languages.add(l));
				}
			});
		});

		return Array.from(languages);
	});
}
