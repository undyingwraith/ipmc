import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { Button } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import { HasPinAbility, PinStatus } from 'ipmc-interfaces';
import React from 'react';
import { usePinManager } from '../../hooks/usePinManager';

export function PinButton(props: { item: HasPinAbility; }) {
	const [status, toggleStatus] = usePinManager(props.item);

	const icon = useComputed(() => {
		const s = status.value;
		return s == PinStatus.Pinned ? <FavoriteIcon /> : s == PinStatus.UnPinned ? <FavoriteBorderIcon /> : <HeartBrokenIcon />;
	});

	return <Button onClick={() => toggleStatus(status.value == PinStatus.UnPinned)}>
		{icon}
	</Button>;
}
