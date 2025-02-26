import { render } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from 'src/components/molecules';
import { describe, expect, test } from 'vitest';

describe('ErrorBoundary', () => {
	test('Catches Error', () => {
		function TestComponent() {
			throw new Error('TestError');
			return (<div />);
		}
		const t = render(
			<ErrorBoundary>
				<TestComponent />
			</ErrorBoundary>
		);

		expect(t.getByTestId('error-message')).not.toBeNull();
		expect(t.getByTestId('error-message')).not.toBeUndefined();
	});
});
