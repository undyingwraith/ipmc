import { Grid } from "@mui/material";
import { useComputed } from "@preact/signals-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useWatcher } from '../../hooks';
import { IMovieLibrary } from "../../service";
import { MoviePosterGridItem, MovieThumbnailGridItem } from "../molecules/GridItems";
import { LoadScreen } from "../molecules/LoadScreen";
import { useApp } from "../pages/AppContext";
import { Display, ILibraryProps } from "../pages/LibraryManager";

export function MovieLibrary(props: ILibraryProps<IMovieLibrary>) {
	const [_t] = useTranslation();
	const { profile } = useApp();

	const index = useWatcher(profile.libraries.get(props.library.name)?.value.index);

	return useComputed(() => {
		const display = props.display.value;
		const i = index.value;

		return i?.cid == undefined ? (
			<LoadScreen text={_t('Loading')} />
		) : (
			<Grid container spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
				{i.values.map(v => <Grid item key={v.file.cid}>{display == Display.Poster ? <MoviePosterGridItem movie={v} /> : <MovieThumbnailGridItem movie={v} />}</Grid>)}
			</Grid>
		);
	});
}
