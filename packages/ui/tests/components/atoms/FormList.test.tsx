import { Signal } from '@preact/signals';
import { render } from '@testing-library/preact';
import { CoreModule } from 'ipmc-core';
import React from 'react';
import { FormList } from 'src/components/atoms';
import { AppContextProvider } from 'src/context';
import { describe, expect, test } from 'vitest';

describe('FormList', () => {
	test('Add button works', () => {
		const values = new Signal<Signal<{ name: string; }>[]>([]);

		const t = render(
			<AppContextProvider setup={(app) => {
				app.use(CoreModule);
			}}>
				<FormList
					createItem={() => ({ name: 'test' })}
					renderControl={(data) => <div>{data.value.name}</div>}
					label={new Signal('Test')}
					values={values}
				/>
			</AppContextProvider>
		);
		t.findByText('<Add>').then(c => c.click());

		expect(t.container).toMatchSnapshot();
	});
});
