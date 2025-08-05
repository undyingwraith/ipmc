/**
 * A Notification.
 */
export interface INotification {
	/**
	 * The title of a notification.
	 */
	title: string;

	/**
	 * The optional subtitle of a notification.
	 */
	subTitle?: string;

	/**
	 * Whether or not a notification will be automatically removed.
	 */
	autoRemove: boolean;
}
