import { injectable } from 'inversify';
import { IHotkey, IHotkeyService } from 'ipmc-interfaces';

@injectable()
export class HotkeyService implements IHotkeyService {
	constructor() {
		window.onkeydown = ev => this.handleEvent(ev);
	}

	registerHotkey(hotkey: IHotkey, handler: () => void): symbol {
		const sym = Symbol();
		this.registrations.unshift({
			hotkey,
			handler,
			sym,
		});
		return sym;
	}

	removeHotkey(sym: symbol): void {
		this.registrations = this.registrations.filter((r) => r.sym !== sym);
	}

	private handleEvent(ev: KeyboardEvent) {
		const registration = this.registrations.find(({ hotkey }) =>
			ev.key.toLowerCase() === hotkey.key.toLowerCase()
			&& ((hotkey.ctrl ?? false) === ev.ctrlKey)
			&& ((hotkey.alt ?? false) === ev.altKey)
			&& ((hotkey.shift ?? false) === ev.shiftKey)
		);

		if (registration !== undefined) {
			ev.preventDefault();
			registration.handler();
		}
	}

	/**
	 * The current {@link IHotkey} registrations.
	 */
	private registrations: {
		hotkey: IHotkey;
		handler: () => void;
		sym: symbol;
	}[] = [];
}
