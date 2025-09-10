import { TEvent } from './IPlayerService';

export abstract class BasePlayerService {
	/**
	 * @inheritdoc
	 */
	public addEventListener(ev: TEvent, emit: () => void) {
		this.listeners.push({ ev, emit });
	}

	protected emitEvent(ev: TEvent) {
		this.listeners
			.filter(l => l.ev === ev)
			.forEach(l => l.emit());
	}

	private listeners: {
		ev: TEvent,
		emit: () => void,
	}[] = [];
}
