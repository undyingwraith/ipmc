import { Grid } from "@mui/material";
import { useComputed } from "@preact/signals-react";
import React from "react";
import { useWatcher } from '../../hooks';
import { IMovieLibrary } from "../../service";
import { MovieGridItem } from "../molecules/GridItems";
import { LoadScreen } from "../molecules/LoadScreen";
import { useApp } from "../pages/AppContext";
import { ILibraryProps } from "../pages/LibraryManager";
import { useTranslation } from '../../hooks/useTranslation';

export function MovieLibrary(props: ILibraryProps<IMovieLibrary>) {
	const _t = useTranslation();
	const { profile } = useApp();

	const index = useWatcher(profile.libraries.get(props.library.name)?.value.index);

	return useComputed(() => {
		const i = index.value;

		return i?.cid == undefined ? (
			<LoadScreen text={_t('Loading')} />
		) : (
			<Grid container spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
				{i.values.map(v => <Grid item key={v.file.cid}><MovieGridItem movie={v} display={props.display} /></Grid>)}
			</Grid>
		);
	});
}
