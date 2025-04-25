import { IConfigurationService, INodeService } from 'ipmc-core';

declare global {
	interface Window {
		nodeService: INodeService;
		configService: IConfigurationService;
	}
}
