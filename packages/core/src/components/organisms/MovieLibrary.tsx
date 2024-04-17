import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { IMovieLibrary, IMovieMetaData } from "../../service";
import { MovieIndexer } from "../../service/indexer";
import { useApp } from "../pages/AppContext";
import { LoadScreen } from "../molecules/LoadScreen";
import { Grid } from "@mui/material";
import { MoviePosterGridItem, MovieThumbnailGridItem } from "../molecules/GridItems";
import { Display, ILibraryProps } from "../pages/LibraryManager";

export function MovieLibrary(props: ILibraryProps<IMovieLibrary>) {
	const [_t] = useTranslation();
	const { ipfs, config, profile } = useApp();

	const index = useSignal<IMovieMetaData[]>([]);
	const loading = useSignal<boolean>(true);

	useSignalEffect(() => {
		const lib = props.library;
		loading.value = true;
		const indexer = new MovieIndexer(ipfs, config, profile, lib);
		indexer.fetchIndex()
			.then(r => {
				index.value = r;
			})
			.catch(console.error)
			.finally(() => {
				loading.value = false;
			});
	});

	const content = useComputed(() => {
		const isLoading = loading.value;
		const display = props.display.value;
		return isLoading ? (
			<LoadScreen text={_t('Loading')} />
		) : (
			<Grid container spacing={1}>
				{index.value.map(v => <Grid item key={v.file.cid}>{display == Display.Poster ? <MoviePosterGridItem movie={v} /> : <MovieThumbnailGridItem movie={v} />}</Grid>)}
			</Grid>
		)
	});

	return content;
}
