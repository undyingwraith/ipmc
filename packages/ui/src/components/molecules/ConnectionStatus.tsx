import { Badge, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import React from "react";
import { IIpfsService } from 'ipmc-interfaces';
import { Identicon } from '../atoms';
import { useTranslation } from '../../hooks/useTranslation';

export function ConnectionStatus(props: { ipfs: IIpfsService; }) {
	const peers = useSignal<string[]>([]);
	const anchor = useSignal<HTMLButtonElement | undefined>(undefined);
	const count = useComputed(() => peers.value.length);
	const _t = useTranslation();


	useSignalEffect(() => {
		const updatePeers = () => {
			props.ipfs.peers()
				.then(r => {
					peers.value = r;
				})
				.catch(console.error);
		};
		const i = setInterval(updatePeers, 5000);
		updatePeers();

		return () => {
			clearInterval(i);
		};
	});

	const popover = useComputed(() => anchor.value != undefined ? (
		<Drawer
			open={true}
			onClose={() => anchor.value = undefined}
			anchor={'right'}
		>
			<List
				sx={{
					maxWidth: '50vw',
				}}
			>
				{peers.value.length > 0 ? peers.value.map(p => (
					<ListItem key={p}>
						<ListItemIcon>
							<Identicon value={p.substring(p.lastIndexOf('/') + 1)} />
						</ListItemIcon>
						<ListItemText primary={p.substring(p.lastIndexOf('/') + 1)} secondary={p} />
					</ListItem>
				)) : (
					<ListItem>
						<ListItemText>{_t('NoNodes')}</ListItemText>
					</ListItem>
				)}
			</List>
		</Drawer>
	) : undefined);

	return (<>
		<Badge
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			badgeContent={<>{count}</>}
			color={'primary'}
		>
			<IconButton onClick={(ev) => anchor.value = ev.currentTarget}>
				<Identicon value={props.ipfs.id()} />
			</IconButton>
		</Badge>
		{popover}
	</>);
}
