/**
 * Partitions an array into two.
 * @param array Array to split.
 * @param filter Filter to split by.
 * @returns [matches, non matches]
 */
export function partitionArray<TData>(array: TData[], filter: (value: TData, index: number, array: TData[]) => boolean): [TData[], TData[]] {
	const pass: TData[] = [];
	const fail: TData[] = [];
	array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
	return [pass, fail];
}
