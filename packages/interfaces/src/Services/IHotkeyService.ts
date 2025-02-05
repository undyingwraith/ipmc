export const IHotkeyServiceSymbol = Symbol.for('IHotkeyService');

/**
 * A Hotkey definition.
 */
export interface IHotkey {
	/**
	 * The key to be pressed.
	 */
	key: string;

	/**
	 * Whether or not shift has to be pressed (default: false).
	 */
	shift?: boolean;

	/**
	 * Whether or not alt has to be pressed (default: false).
	 */
	alt?: boolean;

	/**
	 * Whether or not control has to be pressed (default: false).
	 */
	ctrl?: boolean;
}

/**
 * Service to handle {@link IHotkey}.
 */
export interface IHotkeyService {
	/**
	 * Registers a new {@link IHotkey} and its handler.
	 * @param hotkey hotkey to listen to.
	 * @param handler function to handle event occurence.
	 * @returns symbol to remove the event handler.
	 */
	registerHotkey(hotkey: IHotkey, handler: () => void): symbol;

	/**
	 * Removes a {@link IHotkey} registration.
	 * @param sym symbol of the event handler.
	 */
	removeHotkey(sym: symbol): void;
}
