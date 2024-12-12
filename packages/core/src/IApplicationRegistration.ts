import { IModule } from './Modules';
import { interfaces } from 'inversify';

export interface IApplicationRegistration {
	/**
	 * Registers a new service.
	 * @param service service to register.
	 * @param identifier symbol for the service.
	 */
	register<T>(service: interfaces.ServiceIdentifier<T>, identifier: symbol): void;

	/**
	 * Registers a new constant.
	 * @param service service to register.
	 * @param identifier symbol for the service.
	 */
	registerConstant<T>(service: T, identifier: symbol): void;

	/**
	 * Registers a new constant without removing previous registrations.
	 * @param service service to register.
	 * @param identifier symbol for the service.
	 */
	registerConstantMultiple<T>(service: T, identifier: symbol): void;

	/**
	 * Registers a {@link IModule}.
	 * @param module {@link IModule} to use in the {@link IApplication}.
	 */
	use(module: IModule): void;
}
