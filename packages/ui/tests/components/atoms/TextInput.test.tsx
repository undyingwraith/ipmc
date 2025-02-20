import { act, fireEvent, render } from '@testing-library/preact';
import { describe, expect, test } from 'vitest';
import { TextInput } from 'src/components/atoms/TextInput';
import React from 'react';
import { Signal } from '@preact/signals';

describe('TextInput', () => {
	test('Text input changes value', () => {
		const value = new Signal('');
		const t = render(
			<TextInput
				value={value}
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
					value: 'another test',
				},
			});
		});

		expect(value.peek()).toBe('another test');
	});
});
