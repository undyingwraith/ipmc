import MemoryIcon from '@mui/icons-material/Memory';
import { Badge, IconButton, Popover, Stack } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { ITaskManager, ITaskManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { ProcessDisplay } from '../atoms';

export function ActiveProcessesButton() {
	const taskManager = useService<ITaskManager>(ITaskManagerSymbol);
	const anchorEl = useSignal<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		anchorEl.value = event.currentTarget;
	};

	const handleClose = () => {
		anchorEl.value = null;
	};

	return useComputed(() => {
		const status = taskManager.status.value;
		if (status.length > 0) {
			return (<>
				<Badge
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					badgeContent={<>{status.length}</>}
					color={'primary'}
				>
					<IconButton onClick={handleClick}>
						<MemoryIcon />
					</IconButton>
				</Badge>
				<Popover
					open={Boolean(anchorEl.value)}
					anchorEl={anchorEl.value}
					onClose={() => handleClose()}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<Stack gap={1} sx={{ padding: 3 }}>
						{status.map(t => (<ProcessDisplay task={t} />))}
					</Stack>
				</Popover>
			</>
			);
		} else {
			return undefined;
		}
	});
}
