import { IMessage } from './IMessage';
import { SimpleMessage } from './SimpleMessage';

export type IRequestPinsMessage = IMessage<'RequestPins'>;

export class RequestPinsMessage extends SimpleMessage<'RequestPins'> {
	constructor() {
		super('RequestPins');
	}
}

export type IRequestPinsResponse = IMessage<'RequestPinsResponse', { pins: string[]; }>;

export class RequestPinsResponse extends SimpleMessage<'RequestPinsResponse'> {
	constructor(pins: string[]) {
		super('RequestPinsResponse');
		this.pins = pins;
	}

	public pins: string[];
}
