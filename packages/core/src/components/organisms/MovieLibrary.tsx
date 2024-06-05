import { Box, Button, Grid, Paper, Stack } from "@mui/material";
import { useComputed, useSignal } from "@preact/signals-react";
import React from "react";
import { useWatcher } from '../../hooks';
import { IMovieLibrary } from "../../service";
import { MovieGridItem } from "../molecules/GridItems";
import { LoadScreen } from "../molecules/LoadScreen";
import { useApp } from "../pages/AppContext";
import { ILibraryProps } from "../pages/LibraryManager";
import { useTranslation } from '../../hooks/useTranslation';
import { IMovieMetaData } from '../../service/Library';
import { VideoPlayer } from './VideoPlayer';
import { DetailOverlay } from '../atoms/DetailOverlay';

export function MovieLibrary(props: ILibraryProps<IMovieLibrary>) {
	const _t = useTranslation();
	const { profile } = useApp();

	const index = useWatcher<{ cid: string; values: IMovieMetaData[]; } | undefined>(profile.libraries.get(props.library.name)?.value.index as { cid: string; values: IMovieMetaData[]; } | undefined);
	const selected = useSignal<IMovieMetaData | undefined>(undefined);

	const detail = useComputed(() => selected.value !== undefined ? (
		<DetailOverlay>
			<Stack>
				<Paper>
					<Button onClick={() => {
						selected.value = undefined;
					}}>Close</Button>
				</Paper>
				<Box>
					<VideoPlayer file={selected.value} />
				</Box>
			</Stack>
		</DetailOverlay>
	) : undefined);

	return useComputed(() => {
		const i = index.value;

		return i?.cid == undefined ? (
			<LoadScreen text={_t('Loading')} />
		) : (
			<>
				<Grid container spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
					{i.values.map(v => <Grid item key={v.cid}><MovieGridItem onOpen={() => {
						selected.value = v;
					}} movie={v} display={props.display} /></Grid>)}
				</Grid>
				{detail}
			</>
		);
	});
}
