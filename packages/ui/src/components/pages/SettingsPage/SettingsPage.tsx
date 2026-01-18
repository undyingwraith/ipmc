import { ButtonGroup, Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IVersionService, IVersionServiceSymbol } from 'ipmc-core';
import { IIndexManager, IIndexManagerSymbol, IProfile, IProfileSymbol, ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useOptionalService, useService } from '../../../context';
import { useTranslation } from '../../../hooks';
import { ThemeService, ThemeServiceSymbol } from '../../../services';
import { UiDefaults } from '../../../UiDefaults';
import { TextInput } from '../../atoms';
import { ActionButton, ColorPicker } from '../../molecules';
import pageStyles from '../Page.module.scss';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
	const _t = useTranslation();
	const themeService = useService<ThemeService>(ThemeServiceSymbol);
	const translationService = useService<ITranslationService>(ITranslationServiceSymbol);
	const versionService = useService<IVersionService>(IVersionServiceSymbol);
	const indexManager = useOptionalService<IIndexManager>(IIndexManagerSymbol);
	const profile = useOptionalService<IProfile>(IProfileSymbol);

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
		<div className={pageStyles.container + ' ' + pageStyles.scroll + ' ' + styles.page}>
			<h1>{_t('Settings')}</h1>
			<SettingsSection title={'General'}>
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
			</SettingsSection>
			<SettingsSection title={'Style'}>
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
					<TextInput value={accentColor} label={_t('AccentColor')} />
					<ColorPicker
						value={accentColor}
						label={_t('AccentColor')}
						default={UiDefaults.accentColor}
					/>
				</div>
			</SettingsSection>
			{profile && indexManager && (<>
				<SettingsSection title={'Libraries'}>
					{profile.libraries.map((l) => (
						<div key={l.id}>
							<b>{l.name}</b>
							<p>CID: {useComputed(() => indexManager.indexes.get(l.id)?.value?.cid ?? '?')}</p>
							<p>{_t('AmountItems')}: {useComputed(() => indexManager.indexes.get(l.id)?.value?.index.length ?? '?')}</p>
							<ButtonGroup>
								<ActionButton action={({ onProgress, signal }) => indexManager.update(l, { onProgress, signal })}>{_t('Refresh')}</ActionButton>
								<ActionButton action={({ onProgress, signal }) => indexManager.update(l, { force: true, onProgress, signal })}>{_t('ForceRefresh')}</ActionButton>
							</ButtonGroup>
						</div>
					))}
				</SettingsSection>
			</>)}
			<SettingsSection title={'Info'}>
				<table className={pageStyles.table}>
					<tr>
						<th>{_t('Version')}</th>
						<td>{versionService.getVersion()}</td>
					</tr>
					{versionService.getIndexerVersions().map(v => (
						<tr key={v.name}>
							<th>{v.name}</th>
							<td>{v.version}</td>
						</tr>
					))}
				</table>
			</SettingsSection>
		</div>
	);
}

function SettingsSection(props: { title: string, children: any; }) {
	const _t = useTranslation();

	return (
		<Card>
			<CardHeader title={_t(props.title)} />
			<CardContent>
				{props.children}
			</CardContent>
		</Card>
	);
}
