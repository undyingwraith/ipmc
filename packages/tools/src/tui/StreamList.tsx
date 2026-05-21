import React from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { IStream } from './IStream';

export function StreamList(props: {
	streams: IStream[];
	index: number;
	setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { index, setIndex, streams } = props;
	const { isFocused } = useFocus();

	useInput((_, key) => {
		if (!isFocused) return;

		if (key.downArrow && index < streams.length - 1) {
			setIndex(index + 1);
		}
		if (key.upArrow && index > 0) {
			setIndex(index - 1);
		}
	});

	return (
		<Box borderStyle={'round'} flexDirection={'column'} gap={1} borderColor={isFocused ? 'white' : 'gray'}>
			<Box>
				<Text>Streams</Text>
			</Box>
			{streams.map((s, k) => (
				<Box key={s.file + s.id} gap={1}>
					<Text>{index === k ? '>' : ' '}</Text>
					<Text>{s.id}</Text>
					<Text>{s.type}</Text>
					<Text>{s.lang}</Text>
				</Box>
			))}
		</Box>
	);
}
