import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { usePinManager } from '../../hooks/usePinManager';
import { useComputed } from '@preact/signals-react';
import { IconButton } from '@mui/material';
import { HasPinAbility, PinStatus } from 'ipmc-interfaces';

export function PinButton(props: { item: HasPinAbility; }) {
	const [status, toggleStatus] = usePinManager(props.item);

	const icon = useComputed(() => {
		const s = status.value;
		return s == PinStatus.Pinned ? <FavoriteIcon /> : s == PinStatus.UnPinned ? <FavoriteBorderIcon /> : <HeartBrokenIcon />;
	});

	return <IconButton onClick={() => toggleStatus(status.value == PinStatus.UnPinned)}>
		{icon}
	</IconButton>;
}
