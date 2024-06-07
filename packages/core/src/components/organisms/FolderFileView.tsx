import React from 'react';
import { Box, Button, Paper, Stack } from '@mui/material';
import { IFileInfo, IFolderFile, isIFolderFile } from '../../service';
import { useComputed, useSignal } from '@preact/signals-react';
import { DetailOverlay } from '../atoms/DetailOverlay';

export function FolderFileView(props: { file: IFolderFile; onClose: () => void; }) {
	const selected = useSignal<IFileInfo | undefined>(undefined);

	const detail = useComputed(() => selected.value !== undefined ? isIFolderFile(selected.value) ? <FolderFileView file={selected.value} onClose={() => {
		selected.value = undefined;
	}} /> : (
		<DetailOverlay>
			<Stack>
				<Paper>
					<Button onClick={() => {
						selected.value = undefined;
					}}>Back</Button>
				</Paper>
				<Box>
					Item detail: {JSON.stringify(selected.value)}
				</Box>
			</Stack>
		</DetailOverlay>
	) : undefined);

	return <DetailOverlay>
		<Stack>
			<Paper>
				<Button onClick={props.onClose}>Close</Button>
			</Paper>
			<Box>
				{props.file.items.map(i => <Box key={i.cid}>
					<Button onClick={() => {
						selected.value = i;
					}}>View</Button>
				</Box>)}
			</Box>
		</Stack>
		{detail}
	</DetailOverlay>;
}
