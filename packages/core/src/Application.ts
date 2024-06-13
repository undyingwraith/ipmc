import { Container, interfaces } from 'inversify';
import { IApplication } from './IApplication';
import { IModule } from './Modules/IModule';

export class Application implements IApplication {
	public register<T>(service: interfaces.Newable<T>, identifier: symbol) {
		if (this.container.isBound(identifier)) {
			this.container.unbind(identifier);
		}
		this.container.bind<T>(identifier).to(service);
	}

	getService<T>(identifier: symbol): T | undefined {
		return this.container.get<T>(identifier);
	}

	use(module: IModule): void {
		module(this);
	}

	/**
	 * The IOC {@link Container} of the {@link IApplication}.
	 */
	private readonly container = new Container({
		defaultScope: 'Singleton',
	});
}
