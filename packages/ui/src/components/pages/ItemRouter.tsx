import { IFileInfo, isIFolderFile } from 'ipmc-interfaces';
import { Route } from 'wouter';
import { ItemPage } from './ItemPage';

export function ItemRouter(props: {
	items: IFileInfo[];
}) {
	return (
		<Route path={'/:item'} nest>
			{(params: { item: string; }) => {
				const item = props.items.find(i => i.name === params.item);
				return (<>
					<Route path={'/'}>
						{item ? <ItemPage item={item} /> : <div>Item not found</div>}
					</Route>
					{isIFolderFile(item) && <ItemRouter items={item.items} />}
				</>);
			}}
		</Route>
	);
}
