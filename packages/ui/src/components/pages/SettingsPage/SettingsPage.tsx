import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../../context';
import { useTranslation } from '../../../hooks';
import { ThemeService, ThemeServiceSymbol } from '../../../services';
import { TextInput, ThemeToggle } from '../../atoms';
import styles from '../Page.module.css';

export function SettingsPage() {
	const _t = useTranslation();
	const themeService = useService<ThemeService>(ThemeServiceSymbol);
	const translationService = useService<ITranslationService>(ITranslationServiceSymbol);

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
		<div className={styles.container}>
			<h1>Settings</h1>
			<div>
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">{_t('Language')}</InputLabel>
					{useComputed(() => (
						<Select
							labelId={'demo-simple-select-label'}
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
			<div>
				{_t('DarkMode')}
				<ThemeToggle />
			</div>
			<div>
				{/* TODO: color picker instead of this */}
				<TextInput value={accentColor} label={_t('AccentColor')} />
			</div>
		</div>
	);
}
