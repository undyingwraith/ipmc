/**
 * Inteleaves an array with the specified thing.
 * @param arr array to use as source.
 * @param thing item to interleave.
 * @returns a new array with thing in between every item in the array.
 */
export function interleave<T>(arr: T[], thing: T) {
	return ([] as T[]).concat(...arr.map(n => [n, thing])).slice(0, -1);
}
