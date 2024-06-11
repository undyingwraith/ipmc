import { Container, interfaces } from 'inversify';
import { IApplication } from './IApplication';
import { IModule } from './Modules/IModule';

/**
 * @inheritdoc
 */
export class Application implements IApplication {
	/**
	 * @inheritdoc
	 */
	public register<T>(service: interfaces.ServiceIdentifier<T>, identifier: symbol) {
		this.container.bind<T>(identifier).toService(service);
	}

	/**
	 * @inheritdoc
	 */
	getService<T>(identifier: symbol): T | undefined {
		return this.container.get(identifier);
	}

	/**
	 * @inheritdoc
	 */
	use(module: IModule): void {
		module(this);
	}

	private readonly container = new Container();
}
