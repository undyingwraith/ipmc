import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { IStream } from './IStream';
import { Select, TextInput } from '@inkjs/ui';

export function EditStream(props: { stream: IStream; }) {
	const { stream } = props;

	const [language, setLanguage] = useState(stream.lang);
	const [role, setRole] = useState(stream.role);

	return (
		<Box flexDirection={'column'} borderStyle={'round'}>
			<Box borderColor={'gray'}>
				<Text>File: {stream.file}</Text>
			</Box>
			<Box borderColor={'gray'}>
				<Text>Id: {stream.id}</Text>
			</Box>
			<Box borderColor={'gray'}>
				<Text>Type: {stream.type}</Text>
			</Box>
			{stream.type !== 'video' && (
				<Box borderColor={'gray'}>
					<Text>Language: </Text>
					<TextInput
						defaultValue={language}
						onChange={e => {
							setLanguage(e);
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
							setRole(v);
						}}
						defaultValue={role}
					/>
				</Box>
			</>)}
		</Box>
	);
}
