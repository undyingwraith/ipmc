import { Divider, List } from '@mui/material';
import { interleave } from 'ipmc-core';
import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
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
		<List>
			{interleave(files.map((i, k) => (
				<ErrorBoundary key={i.cid}>
					<FileListItem
						file={i}
						onOpen={() => onOpen ? onOpen(i, k) : setLocation(`/${i.name}`)}
						actions={actions ? actions(i, k) : undefined}
						selected={selected === k}
					/>
				</ErrorBoundary>
			)), (
				<Divider />
			))}
		</List>
	);
}
