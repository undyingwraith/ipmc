import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { FileGridItem } from '../molecules/FileGridItem';
import { FileView } from './FileView';
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals-react';
import { LoadScreen } from '../molecules/LoadScreen';
import { Grid } from '@mui/material';
import { IFileInfo } from 'ipmc-interfaces';
import { Display } from '../pages/LibraryManager';
import { useApp } from '../pages/AppContext';
import { useWatcher } from '../../hooks';
import { useHotkey } from '../../hooks/useHotkey';

export function Library(props: {
	display: ReadonlySignal<Display>;
	query?: string;
	library: string;
}) {
	const { display } = props;
	const { profile } = useApp();
	const _t = useTranslation();

	const selected = useSignal<IFileInfo | undefined>(undefined);
	const index = useWatcher<{ cid: string; values: IFileInfo[]; } | undefined>(profile.libraries.get(props.library)?.value.index as { cid: string; values: IFileInfo[]; } | undefined);

	useHotkey({ key: 'Escape' }, () => {
		selected.value = undefined;
	});

	const detail = useComputed(() => selected.value !== undefined ? (
		<FileView
			file={selected.value}
			display={display}
			onClose={() => {
				selected.value = undefined;
			}}
		/>
	) : undefined);

	return useComputed(() => {
		const i = index.value;

		return i?.cid == undefined ? (
			<LoadScreen text={_t('Loading')} />
		) : (
			<>
				<Grid container spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
					{i.values.map(v => (
						<Grid item key={v.cid}>
							<FileGridItem
								onOpen={() => {
									selected.value = v;
								}}
								file={v}
								display={props.display}
							/>
						</Grid>
					))}
				</Grid>
				{detail}
			</>
		);
	});
}
