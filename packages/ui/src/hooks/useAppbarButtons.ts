import { useEffect } from 'react';
import { useService } from '../context';
import { AppbarButtonService, AppbarButtonServiceSymbol } from '../services';
import { IAppbarButtonOptions } from '../services/AppbarButtonService';

export function useAppbarButtons(buttons: IAppbarButtonOptions[]) {
	const appbarService = useService<AppbarButtonService>(AppbarButtonServiceSymbol);

	useEffect(() => {
		const ids: Symbol[] = [];

		for (const btn of buttons) {
			ids.push(appbarService.registerAppbarButton(btn));
		}

		return () => {
			for (const id of ids) {
				appbarService.unRegisterAppbarButton(id);
			}
		};
	}, []);
}
