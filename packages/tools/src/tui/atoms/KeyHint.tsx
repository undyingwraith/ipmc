import { Box, Text } from 'ink';
import React from 'react';

export function KeyHint(props: { hotkey: string, description: string; }) {
	return (
		<Box>
			<Text backgroundColor={'white'} color={'black'}>{props.hotkey}</Text>
			<Text backgroundColor={'gray'}> {props.description}</Text>
		</Box>
	);
}
