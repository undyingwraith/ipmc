export function parseIpns(v: string): {
	name: string;
	path: string;
	dnsLink: boolean;
} {
	const unprefixed = v.startsWith('/ipns/') ? v.substring(6) : v;
	const index = unprefixed.indexOf('/');
	const name = unprefixed.substring(0, index === -1 ? undefined : index);
	const path = index === -1 ? '/' : unprefixed.substring(unprefixed.indexOf('/')) + '/';

	return {
		name,
		path,
		dnsLink: name.includes('.'),
	};
}
