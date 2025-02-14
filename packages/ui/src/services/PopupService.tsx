import { Dialog } from '@mui/material';
import { inject, injectable, preDestroy } from 'inversify';
import { Application, IApplicationSymbol } from 'ipmc-core';
import { IPopupOptions, IPopupService } from 'ipmc-interfaces';
import { ThemeProvider } from '../context';
import { AppContext } from '../context/AppContext';
import { ErrorBoundary } from '../components/atoms/ErrorBoundary';
import { ComponentChildren, render } from 'preact';

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
			const close = () => {
				resolve();
			};
			render(<AppContext.Provider value={this.app}>
				<ThemeProvider>
					<Popup
						onClose={close}
						closeOnOutsideClick={options.closeOnOutsideClick ?? true}
					>{options.content(close)}</Popup>
				</ThemeProvider>
			</AppContext.Provider>, this.mountPoint);
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
	children: ComponentChildren;
}

function Popup(props: IPopupProps) {
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
