import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo, isIFolderFile } from 'ipmc-interfaces';
import React from 'react';
import { Route } from 'wouter';
import { ItemPage } from './ItemPage';
import { Display } from './LibraryManager';

export function ItemRouter(props: {
	items: IFileInfo[];
	display: ReadonlySignal<Display>;
}) {
	return (
		<Route path={'/:item'} nest>
			{(params) => {
				const item = props.items.find(i => i.name === params.item);
				return (<>
					<Route path={'/'}>
						{item ? <ItemPage item={item} display={props.display} /> : <div>Item not found</div>}
					</Route>
					{isIFolderFile(item) && <ItemRouter items={item.items} display={props.display} />}
				</>);
			}}
		</Route>
	);
}
