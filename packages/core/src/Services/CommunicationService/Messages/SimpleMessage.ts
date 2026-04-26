import { IMessage } from './IMessage';

export class SimpleMessage<T extends string> implements IMessage<T> {
	constructor(type: T) {
		this.type = type;
	}

	public type: T;
}

export function isSimpleMessage(item: any): item is IMessage<any> {
	return Object.hasOwn(item, 'type');
}
