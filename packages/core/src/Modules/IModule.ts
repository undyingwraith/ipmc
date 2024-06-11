import { IApplication } from '../IApplication';

/**
 * A Module for an @see IApplication.
 * @param app the instance of an @see IApplication.
 */
export type IModule = (app: IApplication) => void;
