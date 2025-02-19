import React from 'react';
import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserModule, CoreModule } from 'ipmc-core';
import { IFileInfo, IIpfsServiceSymbol } from 'ipmc-interfaces';
import { FileInfoDisplay } from 'src/components/atoms/FileInfoDisplay';
import { AppContextProvider } from 'src/context';

describe('FileInfoDisplay', () => {
	test('Renders data correctly', () => {
		const fileInfo: IFileInfo = {
			cid: 'TestCid',
			name: 'Test name',
			type: 'dir'
		};

		const t = render(
			<AppContextProvider setup={(app) => {
				app.use(CoreModule);
				app.use(BrowserModule);
				app.registerConstant({}, IIpfsServiceSymbol);
			}}>
				<FileInfoDisplay file={fileInfo} />
			</AppContextProvider>);
		expect(t).toMatchSnapshot();
	});
});
