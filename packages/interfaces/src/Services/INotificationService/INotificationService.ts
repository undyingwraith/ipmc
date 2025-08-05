import { INotification } from './INotification';
import { ReadonlySignal } from '@preact/signals-core';

export const INotificationServiceSymbol = Symbol.for('INotificationService');

/**
 * Service to manage {@link INotification}'s.
 */
export interface INotificationService {
	/**
	 * Adds a new {@link INotification}.
	 * @param notification The {@link INotification} to add.
	 */
	notify(notification: INotification): Symbol;

	/**
	 * Removes an active {@link INotification}.
	 * @param symbol Symbol of the notification to remove.
	 */
	clearNotification(symbol: Symbol): void;

	/**
	 * The Currently active {@link INotification}'s.
	 */
	notifications: ReadonlySignal<INotification[]>;
}
