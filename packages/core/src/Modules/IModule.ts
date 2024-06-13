import { IApplication } from '../IApplication';

/**
 * A Module for an {@link IApplication}.
 * @param app the instance of an {@link IApplication}.
 */
export type IModule = (app: IApplication) => void;
