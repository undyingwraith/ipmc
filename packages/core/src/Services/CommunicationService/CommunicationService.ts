import { StreamMessageEvent, Stream, Connection } from '@libp2p/interface';
import { inject, injectable } from 'inversify';
import { IIpfsService, IIpfsServiceSymbol, ILogService, ILogServiceSymbol, IPinManagerService, IPinManagerServiceSymbol } from 'ipmc-interfaces';
import { ICommunicationService } from './ICommunicationService';
import { decodeMulti, encode } from '@msgpack/msgpack';
import { RequestPinsMessage, RequestPinsResponse } from './Messages/RequestPins';
import { IMessage } from './Messages/IMessage';

@injectable()
export class CommunicationService implements ICommunicationService {
	constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(IPinManagerServiceSymbol) private readonly pinManager: IPinManagerService,
	) {
		//TODO: remove once startup actions are in
		this.start();
	}

	public async start() {
		await this.ipfs.handle(this.protocol, (stream, con) => this.handleStream(stream, con));
		await this.ipfs.register(this.protocol, {
			notifyOnLimitedConnection: true,
			onConnect: async (peer, connection) => {
				console.log('protocol peer connected', peer.toString(), connection);

				//TODO: Tag peer to keep connection
				/*await libp2p.peerStore.merge(peer, {
					tags: {
						ipmc: {
							value: 50
						}
					}
				});*/

				const stream = await connection.newStream(this.protocol);
				this.handleStream(stream, connection);
				stream.send(encode(new RequestPinsMessage()));
			},
			onDisconnect: (peer) => {
				//TODO: handle disconnect
			},
		});
		this.log.info('CommunicationService started!');
	}

	private handleStream(stream: Stream, con: Connection) {
		stream.addEventListener('message', (evt) => this.handleMessage(stream, con, evt));

		stream.addEventListener('remoteCloseWrite', () => {
			stream.close();
		});
	}

	private handleMessage(stream: Stream, con: Connection, evt: StreamMessageEvent) {
		for (const data of decodeMulti(evt.data.subarray())) {
			const msg = data as IMessage<any>;
			switch (msg.type) {
				case 'RequestPins':
					stream.send(encode(new RequestPinsResponse(this.pinManager.listPins().map(p => p.cid))));
					break;
				case 'RequestPinsResponse':
					console.log(msg, con.remotePeer.toString());
					break;
			}
		}
	}

	private readonly protocol = '/ipmc/0.1.0';
}
