import { describe, expect, test } from 'vitest';
import { interleave } from '../../src';

describe('interleave', () => {
	test('works with array of one', () => {
		const source = ['one'];
		const final = interleave(source, '-');

		expect(final.length).toBe(1);
	});

	test('works with array of two', () => {
		const source = ['one', 'two'];
		const final = interleave(source, '-');

		expect(final.length).toBe(3);
		expect(final[0]).toBe('one');
		expect(final[1]).toBe('-');
		expect(final[2]).toBe('two');
	});
});
