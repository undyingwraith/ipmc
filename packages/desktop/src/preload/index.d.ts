import { ElectronAPI } from '@electron-toolkit/preload'
import { IConfigurationService, INodeService } from 'ipm-core'

declare global {
	interface Window {
		electron: ElectronAPI
		nodeService: INodeService
		configService: IConfigurationService
	}
}
