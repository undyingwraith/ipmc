import { Backdrop, Box, Button, Grid, Paper, Stack } from "@mui/material";
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

export function MovieLibrary(props: ILibraryProps<IMovieLibrary>) {
	const _t = useTranslation();
	const { profile, ipfs } = useApp();

	const index = useWatcher<{ cid: string; values: IMovieMetaData[]; } | undefined>(profile.libraries.get(props.library.name)?.value.index as { cid: string; values: IMovieMetaData[]; } | undefined);
	const selected = useSignal<IMovieMetaData | undefined>(undefined);

	const detail = useComputed(() => selected.value !== undefined ? (
		<Backdrop
			open={true}
			sx={{
				marginTop: '64px',
				width: '100vw',
				height: 'calc(100vh - 64px)',
			}}
		>
			<Stack>
				<Paper>
					<Button onClick={() => {
						selected.value = undefined;
					}}>Close</Button>
				</Paper>
				<Box>
					<video controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
						<source src={ipfs.toUrl(selected.value.video.cid)}></source>
					</video>
				</Box>
			</Stack>
		</Backdrop>
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
