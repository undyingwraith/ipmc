import { IApplicationRegistration } from '../IApplicationRegistration';

/**
 * A Module for an {@link IApplication}.
 * @param app the instance of an {@link IApplication}.
 */
export type IModule = (app: IApplicationRegistration) => void;
