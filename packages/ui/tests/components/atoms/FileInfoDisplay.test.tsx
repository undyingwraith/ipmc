import { FileInfoDisplay } from '@src/components/atoms';
import { AppContextProvider } from '@src/context';
import { render } from '@testing-library/preact';
import { BrowserModule, CoreModule } from 'ipmc-core';
import { IFileInfo, IIpfsServiceSymbol } from 'ipmc-interfaces';
import { describe, expect, test } from 'vitest';

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
