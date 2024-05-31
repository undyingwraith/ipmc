import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { PinStatus, usePinManager } from '../../hooks/usePinManager';
import { useComputed } from '@preact/signals-react';
import { IconButton } from '@mui/material';

export function PinButton(props: { cid: string; }) {
	const [status, toggleStatus] = usePinManager(props.cid);

	const icon = useComputed(() => {
		const s = status.value;
		return s == PinStatus.Pinned ? <FavoriteIcon /> : s == PinStatus.UnPinned ? <FavoriteBorderIcon /> : <HeartBrokenIcon />;
	});

	return <IconButton onClick={() => toggleStatus(status.value == PinStatus.UnPinned)}>
		{icon}
	</IconButton>;
}
