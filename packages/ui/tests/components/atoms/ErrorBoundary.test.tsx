import { render } from '@testing-library/preact';
import { ErrorBoundary } from 'src/components/atoms';
import { describe, expect, test } from 'vitest';

describe('ErrorBoundary', () => {
	test('Renders error message on error', () => {
		function TestComponent() {
			throw new Error('Sample error');
			return <div />;
		}

		const t = render(
			<ErrorBoundary>
				<TestComponent />
			</ErrorBoundary>
		);

		console.log('render');

		expect(t).toMatchSnapshot();
	});

	test('Renders component if no error is present', () => {
		const t = render(
			<ErrorBoundary>
				This is a test
			</ErrorBoundary>
		);

		expect(t.container).toMatchSnapshot();
	});
});
