import { INotification, INotificationService } from 'ipmc-interfaces';
import { computed, ReadonlySignal, Signal } from '@preact/signals-core';

/**
 * @inheritdoc
 */
interface IInternalNotification extends INotification {
	/**
	 * Symbol of the {@link INotification} used to clear the {@link INotification}.
	 */
	symbol: Symbol;
}

/**
 * @inheritdoc
 */
export class NotificationService implements INotificationService {
	/**
	 * @inheritdoc
	 */
	public notify(notification: INotification): Symbol {
		const sym = Symbol();

		this.internalNotifications.value = [...this.internalNotifications.value, { ...notification, symbol: sym }];

		if (notification.autoRemove) {
			setTimeout(() => {
				this.clearNotification(sym);
			}, 5000);
		}

		return sym;
	}

	/**
	 * @inheritdoc
	 */
	public clearNotification(symbol: Symbol): void {
		this.internalNotifications.value = this.internalNotifications.value.filter(n => n.symbol !== symbol);
	}

	/**
	 * @inheritdoc
	 */
	public notifications: ReadonlySignal<INotification[]> = computed(() => this.internalNotifications.value.map(n => ({ ...n, symbol: undefined })));

	private internalNotifications: Signal<IInternalNotification[]> = new Signal<IInternalNotification[]>([]);
}
