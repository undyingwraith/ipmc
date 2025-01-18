import { Container, interfaces } from 'inversify';
import { IApplication, IApplicationSymbol } from './IApplication';
import { IModule } from './Modules/IModule';
import { IApplicationRegistration } from './IApplicationRegistration';

export class Application implements IApplication, IApplicationRegistration {
	public constructor(container?: Container) {
		if (container) {
			this.container = container;
		}
		this.container.bind(IApplicationSymbol).toConstantValue(this);
	}

	public registerConstant<T>(service: T, identifier: symbol) {
		if (this.container.isCurrentBound(identifier)) {
			this.container.unbind(identifier);
		}
		this.container.bind<T>(identifier).toConstantValue(service);
	}

	public registerConstantMultiple<T>(service: T, identifier: symbol) {
		this.container.bind<T>(identifier).toConstantValue(service);
	}

	public register<T>(service: interfaces.Newable<T>, identifier: symbol) {
		if (this.container.isCurrentBound(identifier)) {
			this.container.unbind(identifier);
		}
		this.container.bind<T>(identifier).to(service);
	}

	public use(module: IModule): void {
		module(this);
	}

	public getService<T>(identifier: symbol): T | undefined {
		return this.container.get<T>(identifier);
	}

	public createChildApplication(): Application {
		return new Application(this.container.createChild());
	}

	/**
	 * The IOC {@link Container} of the {@link IApplication}.
	 */
	private readonly container = new Container({
		defaultScope: 'Singleton',
	});
}
