import { Grid } from "@mui/material";
import { useComputed } from "@preact/signals-react";
import React from "react";
import { ISeriesLibrary } from '../../service/Library/ILibrary';
import { SeriesPosterGridItem } from '../molecules/GridItems/SeriesGridItem';
import { LoadScreen } from "../molecules/LoadScreen";
import { useApp } from "../pages/AppContext";
import { ILibraryProps } from "../pages/LibraryManager";
import { useTranslation } from '../../hooks/useTranslation';

export function SeriesLibrary(props: ILibraryProps<ISeriesLibrary>) {
	const _t = useTranslation();
	const { profile } = useApp();

	const library = profile.libraries.get(props.library.name);
	const index = useComputed(() => library?.value.index);

	return useComputed(() => {
		const i = index.value;

		return i?.cid == undefined ? (
			<LoadScreen text={_t('Loading')} />
		) : (
			<Grid container spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
				{i.values.map(v => <Grid item key={v.title}><SeriesPosterGridItem serie={v} /></Grid>)}
			</Grid>
		);
	});
}
