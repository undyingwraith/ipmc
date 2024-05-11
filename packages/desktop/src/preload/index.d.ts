import { IConfigurationService, INodeService } from 'ipm-core';

declare global {
	interface Window {
		nodeService: INodeService;
		configService: IConfigurationService;
	}
}
