import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
import { List } from 'react-window';
import { useLocation } from 'wouter';
import { ErrorBoundary, FileListItem } from '../molecules';

export function FileList(props: {
	files: IFileInfo[];
	onOpen?: (item: IFileInfo, key: number) => void;
	actions?: (f: IFileInfo, k: number) => any;
	selected?: number;
}) {
	const { files, onOpen, actions, selected } = props;

	const [_, setLocation] = useLocation();

	return (
		<List
			rowComponent={({ files, index, style }) => {
				const f = files[index];
				return (
					<ErrorBoundary key={f.cid}>
						<FileListItem
							style={style}
							file={f}
							onOpen={() => onOpen ? onOpen(f, index) : setLocation(`/${f.name}`)}
							actions={actions ? actions(f, index) : undefined}
							selected={selected === index}
						/>
					</ErrorBoundary>
				);
			}}
			rowProps={{ files }}
			rowCount={files.length}
			rowHeight={90}
		/>
	);
}
