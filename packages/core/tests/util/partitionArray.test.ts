import { describe, expect, test } from 'vitest';
import { partitionArray } from '../../src';

describe('partitionArray', () => {
	test('can partition an array of booleans', () => {
		const source = [true, false, true, true, false];

		const [truthy, falsy] = partitionArray(source, (v) => v);

		expect(truthy.length).toBe(3);
		expect(truthy[0]).toEqual(true);
		expect(falsy.length).toBe(2);
		expect(falsy[0]).toEqual(false);
	});
});
