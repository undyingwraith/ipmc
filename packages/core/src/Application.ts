import { Container, interfaces } from 'inversify';

export class Application {
	/**
	 * Registers a new service.
	 * @param service service to register.
	 * @param identifier symbol for the service.
	 */
	public register<T>(service: interfaces.ServiceIdentifier<T>, identifier: symbol) {
		this.container.bind<T>(identifier).toService(service);
	}

	/**
	 * Gets a service identified by its symbol.
	 * @param identifier symbol for the service.
	 * @returns The requested service.
	 */
	getService<T>(identifier: symbol): T | undefined {
		return this.container.get(identifier);
	}

	private readonly container = new Container();
}
