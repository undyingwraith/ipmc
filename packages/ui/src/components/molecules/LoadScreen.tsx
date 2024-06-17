import React from "react";
import { Box, Typography } from "@mui/material";
import { Loader } from "../atoms";
import { ReadonlySignal } from '@preact/signals-react';
import { useTranslation } from '../../hooks';

export function LoadScreen(props: { text?: string | ReadonlySignal<string>; }) {
	const { text } = props;
	const _t = useTranslation();

	return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%'
		}}>
			<Box>
				<Typography>{text ?? _t('Loading')}</Typography>
				<Loader />
			</Box>
		</Box>
	);
}
