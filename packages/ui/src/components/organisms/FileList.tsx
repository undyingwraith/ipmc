import { IFileInfo } from 'ipmc-interfaces';
import React, { ReactNode } from 'react';
import { List } from 'react-window';
import { useService } from '../../context';
import { INavigationService, INavigationServiceSymbol } from '../../services';
import { ErrorBoundary, FileListItem } from '../molecules';

export function FileList(props: {
	files: IFileInfo[];
	onOpen?: (item: IFileInfo, key: number) => void;
	actions?: (f: IFileInfo, k: number) => any;
	selected?: number;
	header?: { height: number, content: ReactNode; };
}) {
	const { files, onOpen, actions, selected, header } = props;

	const navigationService = useService<INavigationService>(INavigationServiceSymbol);

	return (
		<List
			rowComponent={({ files, index, style }) => {
				const f = files[header ? index - 1 : index];
				if (f == undefined) {
					return <></>;
				}
				return (
					<ErrorBoundary key={f.cid}>
						<FileListItem
							style={style}
							file={f}
							onOpen={() => onOpen ? onOpen(f, index) : navigationService.navigate(`./${f.name}`)}
							actions={actions ? actions(f, index) : undefined}
							selected={selected === index}
						/>
					</ErrorBoundary>
				);
			}}
			rowProps={{ files }}
			rowCount={header ? files.length + 1 : files.length}
			rowHeight={(i) => header && i === 0 ? header.height : 90}
		>
			{header && (
				<div style={{ height: 0 }}>
					{header.content}
				</div>
			)}
		</List>
	);
}
