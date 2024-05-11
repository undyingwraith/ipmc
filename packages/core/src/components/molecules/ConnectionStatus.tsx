import { Badge, IconButton, List, ListItem, ListItemIcon, ListItemText, Popover } from "@mui/material";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import React from "react";
import { IIpfsService } from "../../service";
import { Identicon } from '../atoms';
import { useTranslation } from 'react-i18next';

export function ConnectionStatus(props: { ipfs: IIpfsService; }) {
	const peers = useSignal<string[]>([]);
	const anchor = useSignal<HTMLButtonElement | undefined>(undefined);
	const count = useComputed(() => peers.value.length);
	const [_t] = useTranslation();


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
		<Popover
			open={true}
			anchorEl={anchor.value}
			onClose={() => anchor.value = undefined}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
		>
			<List>
				{peers.value.length > 0 ? peers.value.map(p => (
					<ListItem key={p}>
						<ListItemIcon>
							<Identicon value={p} />
						</ListItemIcon>
						<ListItemText>{p}</ListItemText>
					</ListItem>
				)) : (
					<ListItem>
						<ListItemText>{_t('NoNodes')}</ListItemText>
					</ListItem>
				)}
			</List>
		</Popover>
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
