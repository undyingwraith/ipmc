import React, { useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { Select, TextInput } from '@inkjs/ui';
import { useStore } from './useStore';

export function Metadata() {
	const { metadata, setMetadata } = useStore();
	const [editing, setEditing] = useState(0);
	const [type, setType] = useState('movie');

	const { isFocused } = useFocus();

	useInput((input, key) => {
		if (!isFocused) return;

		if (input === 'e' && editing === 0) {
			setEditing(1);
		}
	});

	return (
		<Box borderStyle={'round'} flexDirection={'column'} gap={1} borderColor={isFocused ? 'white' : 'gray'}>
			<Text>Metadata</Text>
			<Box>
				<Text>Type: </Text>
				{editing === 1 ? (
					<Select
						options={[
							{
								label: 'Movie',
								value: 'movie',
							},
							{
								label: 'Episode',
								value: 'episode',
							},
						]}
						onChange={v => {
							setType(v);
							setEditing(2);
						}}
					/>
				) : (
					<Text>{type}</Text>
				)}
			</Box>
			{metadata.type === 'movie' ? (<>
				<Box>
					<Text>Title: </Text>
					{editing === 2 ? (
						<TextInput
							onSubmit={v => {
								setMetadata({ ...metadata, title: v });
								setEditing(3);
							}}
							defaultValue={metadata.title}
						/>
					) : (
						<Text>{metadata.title}</Text>
					)}
				</Box>
				<Box>
					<Text>Year: </Text>
					{editing === 3 ? (
						<TextInput
							onSubmit={v => {
								setMetadata({ ...metadata, year: v });
								setEditing(0);
							}}
							defaultValue={metadata.year}
						/>
					) : (
						<Text>{metadata.year}</Text>
					)}
				</Box>
			</>) : (<>
			</>)}
		</Box>
	);
}
