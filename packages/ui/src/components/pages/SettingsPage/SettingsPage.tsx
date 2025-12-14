import { FormControl, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IVersionService, IVersionServiceSymbol } from 'ipmc-core';
import { IIndexManager, IIndexManagerSymbol, IProfile, IProfileSymbol, ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../../context';
import { useTranslation } from '../../../hooks';
import { ThemeService, ThemeServiceSymbol } from '../../../services';
import { TextInput } from '../../atoms';
import { ColorPicker } from '../../molecules';
import pageStyles from '../Page.module.css';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
	const _t = useTranslation();
	const themeService = useService<ThemeService>(ThemeServiceSymbol);
	const translationService = useService<ITranslationService>(ITranslationServiceSymbol);
	const versionService = useService<IVersionService>(IVersionServiceSymbol);
	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const profile = useService<IProfile>(IProfileSymbol);

	const accentColor = useSignal(themeService.accentColor.peek());

	useSignalEffect(() => {
		accentColor.subscribe((c) => {
			const s = new Option().style;
			s.color = c;
			if (s.color !== '') {
				themeService.accentColor.value = c;
			}
		});

		themeService.accentColor.subscribe(c => {
			accentColor.value = c;
		});
	});

	return (
		<div className={pageStyles.container + ' ' + pageStyles.scroll}>
			<h1>{_t('Settings')}</h1>
			<div>
				<FormControl fullWidth>
					<InputLabel id={'settings-language'}>{_t('Language')}</InputLabel>
					{useComputed(() => (
						<Select
							labelId={'settings-language'}
							label={_t('Language')}
							value={translationService.language.value}
							onChange={(ev) => {
								translationService.changeLanguage(ev.target.value);
							}}
						>
							<MenuItem value={'en'}>English</MenuItem>
							<MenuItem value={'de'}>Deutsch</MenuItem>
						</Select>
					))}
				</FormControl>
			</div>
			<h2>{_t('Style')}</h2>
			<div className={styles.row}>
				{_t('DarkMode')}
				<div className={pageStyles.spacer} />
				{useComputed(() => (
					<Switch
						checked={themeService.darkMode.value}
						onChange={(ev) => {
							themeService.darkMode.value = ev.target.checked;
						}} />
				))}
			</div>
			<div>
				{/* TODO: color picker instead of this */}
				<TextInput value={accentColor} label={_t('AccentColor')} />
				<ColorPicker
					value={accentColor}
					label={_t('AccentColor')}
				/>
			</div>
			<h2>{_t('Libraries')}</h2>
			<div>
				{profile.libraries.map((l) => (
					<div key={l.id}>
						<b>{l.name}</b>
						<p>CID: {useComputed(() => indexManager.indexes.get(l.id)?.value?.cid ?? '?')}</p>
						<p>{_t('AmountItems')}: {useComputed(() => indexManager.indexes.get(l.id)?.value?.index.length ?? '?')}</p>
					</div>
				))}
			</div>
			<h2>{_t('Info')}</h2>
			<div>
				<p>{_t('Version')}: {versionService.getVersion()}</p>
				<p>{_t('Indexers')}</p>
				{versionService.getIndexerVersions().map(v => (
					<p>{v.name}: {v.version}</p>
				))}
			</div>
		</div>
	);
}
