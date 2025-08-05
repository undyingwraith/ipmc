import { Divider, List } from '@mui/material';
import { interleave } from 'ipmc-core';
import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { ErrorBoundary, FileListItem } from '../molecules';

export function FileList(props: { files: IFileInfo[]; }) {
	const [_, setLocation] = useLocation();

	return (
		<List>
			{interleave(props.files.map(i => (
				<ErrorBoundary key={i.cid}>
					<FileListItem
						file={i}
						onOpen={() => setLocation(`/${i.name}`)}
					/>
				</ErrorBoundary>
			)), (
				<Divider />
			))}
		</List>
	);
}
