import { Dialog } from '@mui/material';
import { inject, injectable, preDestroy } from 'inversify';
import { Application, IApplicationSymbol } from 'ipmc-core';
import { IPopupOptions, IPopupService } from 'ipmc-interfaces';
import React, { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '../components/molecules';
import { ThemeProvider } from '../context';
import { AppContext } from '../context/AppContext';

@injectable()
export class PopupService implements IPopupService {
	constructor(
		@inject(IApplicationSymbol) private app: Application
	) {
		this.mountPoint = document.createElement('div');
		document.getElementsByTagName('body')[0].appendChild(this.mountPoint);
	}

	show(options: IPopupOptions): Promise<void> {
		return new Promise(resolve => {
			const root = createRoot(this.mountPoint);
			const close = () => {
				root.unmount();
				resolve();
			};
			root.render(<AppContext.Provider value={this.app}>
				<ThemeProvider>
					<Popup
						onClose={close}
						closeOnOutsideClick={options.closeOnOutsideClick ?? true}
					>{options.content(close)}</Popup>
				</ThemeProvider>
			</AppContext.Provider>);
		});
	}

	@preDestroy()
	//@ts-ignore
	private deconstructor(): void {
		document.getElementsByTagName('body')[0].removeChild(this.mountPoint);
	}

	private mountPoint: HTMLDivElement;
}

interface IPopupProps {
	onClose: () => void;
	closeOnOutsideClick?: boolean;
}

function Popup(props: PropsWithChildren<IPopupProps>) {
	return (
		<Dialog
			open={true}
			onClose={(_, reason) => {
				if (reason !== 'backdropClick' || props.closeOnOutsideClick) {
					props.onClose();
				}
			}}
		>
			<ErrorBoundary>
				{props.children}
			</ErrorBoundary>
		</Dialog>
	);
}
