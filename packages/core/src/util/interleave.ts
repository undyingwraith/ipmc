export function interleave<T>(arr: T[], thing: T) {
	return ([] as T[]).concat(...arr.map(n => [n, thing])).slice(0, -1);
}
