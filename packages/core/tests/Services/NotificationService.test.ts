import { INotification, INotificationService, INotificationServiceSymbol } from 'ipmc-interfaces';
import { Application, NotificationService } from '../../src';
import { describe, expect, test } from 'vitest';

describe('NotificationService', () => {
	const app = new Application();
	app.register(NotificationService, INotificationServiceSymbol);
	test('notification can be added and removed', () => {
		const service = app.getService<INotificationService>(INotificationServiceSymbol)!;
		expect(service.notifications.value).toEqual([]);

		const notification: INotification = {
			autoRemove: false,
			title: 'test',
			subTitle: 'subTest',
		};

		const sym = service.notify(notification);

		expect(service.notifications.value.length).toBe(1);
		expect(service.notifications.value[0]).toEqual(notification);

		service.clearNotification(sym);

		expect(service.notifications.value).toEqual([]);
	});
});
