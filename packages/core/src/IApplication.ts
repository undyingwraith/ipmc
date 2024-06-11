import { interfaces } from 'inversify';
import { IModule } from './Modules/IModule';

/**
 * The main application holding everything together.
 */
export interface IApplication {
	/**
	 * Registers a new service.
	 * @param service service to register.
	 * @param identifier symbol for the service.
	 */
	register<T>(service: interfaces.ServiceIdentifier<T>, identifier: symbol): void;

	/**
	 * Gets a service identified by its symbol.
	 * @param identifier symbol for the service.
	 * @returns The requested service.
	 */
	getService<T>(identifier: symbol): T | undefined;

	/**
	 * Registers a @see IModule.
	 * @param module @see IModule to use in the @see IApplication.
	 */
	use(module: IModule): void;
}
