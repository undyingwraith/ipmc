import { render } from '@testing-library/react';
import { BrowserModule, CoreModule } from 'ipmc-core';
import { IFileInfo, IIpfsServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { FileInfoDisplay } from 'src/components/atoms/FileInfoDisplay';
import { AppContextProvider } from 'src/context';
import { describe, expect, test } from 'vitest';
import { IObjectUrlControllerSymbol, ObjectUrlController } from '../../../src/services';

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
				app.register(ObjectUrlController, IObjectUrlControllerSymbol);
			}}>
				<FileInfoDisplay file={fileInfo} />
			</AppContextProvider>);
		expect(t).toMatchSnapshot();
	});
});
