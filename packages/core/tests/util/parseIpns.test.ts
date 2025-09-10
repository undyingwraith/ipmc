import { describe, expect, test } from 'vitest';
import { parseIpns } from '../../src';

describe('parseIpns', () => {
	test.each([
		['/ipns/example.com', { name: 'example.com', path: '/', dnsLink: true }],
		['example.com', { name: 'example.com', path: '/', dnsLink: true }],
		['/ipns/example.com/test', { name: 'example.com', path: '/test/', dnsLink: true }],
		['example.com/test', { name: 'example.com', path: '/test/', dnsLink: true }],
		['/ipns/k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p', { name: 'k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p', path: '/', dnsLink: false }],
		['k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p', { name: 'k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p', path: '/', dnsLink: false }],
		['/ipns/k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p/test', { name: 'k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p', path: '/test/', dnsLink: false }],
		['k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p/test', { name: 'k51qzi5uqu5dheabvntleu53colufb2qr55eig75zfrzcra6e9asdxc2qibq4p', path: '/test/', dnsLink: false }],
	])('Can parse ipns "%s"', (value, expected) => {
		const parsed = parseIpns(value);

		expect(parsed).not.toBeUndefined();
		expect(parsed).toEqual(expected);
	});
});
