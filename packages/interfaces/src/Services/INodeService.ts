import { IInternalProfile } from '../Profile';
import { IIpfsService } from './IIpfsService';

/**
 * Service to create new IIPfsService's.
 */
export interface INodeService {
	/**
	 * Creates an internal IIpfsService.
	 * @param profile profile to start with.
	 */
	create(profile?: IInternalProfile): Promise<IIpfsService>;
}
