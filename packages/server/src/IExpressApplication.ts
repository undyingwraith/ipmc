import type { IApplication } from 'ipmc-core';

export interface IExpressApplication extends IApplication {
	start(): Promise<void>;
}
