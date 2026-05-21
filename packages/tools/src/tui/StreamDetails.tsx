import React, { useMemo, useState } from 'react';
import { Box, useFocus, Text, useInput } from 'ink';
import { IStream } from './IStream';
import { Select, TextInput } from '@inkjs/ui';

export function StreamDetails(props: { stream?: IStream; onChange: (updated: IStream) => void; }) {
	const { stream, onChange } = props;

	const [index, setIndex] = useState(0);
	const [editing, setEditing] = useState(false);
	const { isFocused } = useFocus();

	const values = useMemo(() => {
		const values = [];
		if (stream) {
			values.push({
				name: 'File',
				id: 'file',
				editable: false,
			});
			values.push({
				name: 'Id',
				id: 'id',
				editable: false,
			});
			values.push({
				name: 'Type',
				id: 'type',
				editable: false,
			});
		}
		return values;
	}, [stream]);

	useInput((input, key) => {
		if (!isFocused) return;

		if (input == 'e' && values[index].editable) {
			setEditing(true);
		}

		if (!editing) {
			if (key.downArrow && index < values.length - 1) {
				setIndex(index + 1);
			}
			if (key.upArrow && index > 0) {
				setIndex(index - 1);
			}
		}
	});

	return (
		<Box
			gap={1}
			borderStyle={'round'}
			borderColor={isFocused ? 'white' : 'gray'}
			flexDirection={'column'}
		>
			<Text>Details</Text>
			{values.map((v, k) => (<Box key={v.name} gap={1}>
				<Text>{k === index ? '>' : ' '}</Text>
				<Text italic={!v.editable}>{v.name}</Text>
				<Text>
					{editing ? (
						<TextInput
							//@ts-ignore
							defaultValue={stream![v.id]}
							onSubmit={e => {
								//@ts-ignore
								onChange({ ...stream, [v.id]: e });
							}}
						/>
						//@ts-ignore
					) : stream![v.id]}
				</Text>
			</Box>))}
			{stream && (<>
				{stream.type !== 'video' && (
					<Box borderColor={'gray'}>
						<Text>Language: </Text>
						<TextInput
							defaultValue={stream.lang}
							onSubmit={e => {
								onChange({ ...stream, lang: e });
							}}
						/>
					</Box>
				)}
				{stream.type === 'subtitle' && (<>
					<Box borderColor={'gray'}>
						<Text>Role: </Text>
						<Select
							options={[
								{
									label: 'Red',
									value: 'red',
								},
								{
									label: 'Green',
									value: 'green',
								},
								{
									label: 'Yellow',
									value: 'yellow',
								},
							]}
							onChange={v => {
								onChange({ ...stream, role: v });
							}}
							defaultValue={stream.role}
						/>
					</Box>
				</>)}
			</>)}
		</Box>
	);
}
