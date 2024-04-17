import { ReadonlySignal, useSignal } from "@preact/signals-react";
import { IMovieMetaData } from "../service";

export function useMovieIndex(): ReadonlySignal<IMovieMetaData[]> {
	const index = useSignal<IMovieMetaData[]>([]);

	return index;
}