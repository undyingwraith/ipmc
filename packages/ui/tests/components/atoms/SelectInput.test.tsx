import { Signal } from '@preact/signals';
import { act, fireEvent, render } from '@testing-library/preact';
import React from 'react';
import { SelectInput } from 'src/components/atoms';
import { describe, expect, test } from 'vitest';

describe('SelectInput', () => {
	test('Select input changes value', () => {
		const value = new Signal('');
		const t = render(
			<SelectInput
				value={value}
				options={{
					test: new Signal('Test'),
					test2: new Signal('Test2'),
				}}
			/>
		);

		act(() => {
			fireEvent.change(t.getByTestId('content-input'), {
				target: {
					value: 'test',
				},
			});
		});

		expect(value.peek()).toBe('test');

		act(() => {
			fireEvent.change(t.getByTestId('content-input'), {
				target: {
					value: 'test2',
				},
			});
		});

		expect(value.peek()).toBe('test2');
	});
});
