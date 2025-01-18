/**
 * Options for a popup.
 */
export interface IPopupOptions {
	/**
	 * Whether or not to close on outside click (default: true).
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Content of the popup.
	 * @param close Function to close the popup.
	 * @returns The component to display.
	 */
	content: (close: () => void) => any;
}
