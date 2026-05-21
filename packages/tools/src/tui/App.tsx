import { Spinner, TextInput } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React, { useMemo, useState } from 'react';
import { ITempDir } from '../utils/tempDIr';
import { KeyHint } from './atoms/KeyHint';
import { detectStreams } from './detectStreams';
import { EditStream } from './EditStream';
import { FileBrowser } from './FileBrowser';
import { IStream } from './IStream';
import { Metadata } from './Metadata';
import { StreamDetails } from './StreamDetails';
import { StreamList } from './StreamList';

export function App(props: { workDir: ITempDir; }) {
	const [dialog, setDialog] = useState<string>();
	const [streams, setStreams] = useState<IStream[]>([]);
	const [index, setIndex] = useState(0);

	const selected = useMemo(() => index < streams.length ? streams[index] : undefined, [streams, index]);

	useInput((input, key) => {
		if (input === 'a' && key.ctrl) {
			setDialog('add_file');
		}
		if (input === 'r' && key.ctrl) {
			setStreams([]);
			props.workDir.clean(true);
		}
		if (key.escape && dialog !== 'loading') {
			setDialog(undefined);
		}
	});

	switch (dialog) {
		case 'add_file':
			return (
				<Box margin={1} borderStyle={'round'}>
					<Text>Add file: </Text>
					<TextInput onSubmit={v => {
						setDialog('loading');
						detectStreams(v)
							.then(r => {
								setStreams([...streams, ...r]);
							})
							.finally(() => {
								setDialog(undefined);
							});
					}} />
					<FileBrowser onSubmit={v => {
						setDialog('loading');
						detectStreams(v)
							.then(r => {
								setStreams([...streams, ...r]);
							})
							.finally(() => {
								setDialog(undefined);
							});
					}} />
				</Box>
			);
		case 'loading':
			return (
				<Spinner label="Loading" />
			);
		case 'edit':
			return (
				<EditStream stream={streams[index]} />
			);
		default:
			return (<Box flexDirection={'column'} margin={1}>
				<Metadata />
				<Box flexDirection={'row'} alignItems={'flex-start'}>
					<StreamList streams={streams} index={index} setIndex={setIndex} />
					<StreamDetails stream={selected} onChange={s => setStreams(streams.toSpliced(index, 1, s))} />
				</Box>
				<Box gap={1} alignItems={'center'}>
					<KeyHint hotkey={'tab'} description={'Switch focus'} />
					<KeyHint hotkey={'^A'} description={'Add a file'} />
					<KeyHint hotkey={'^R'} description={'Reset'} />
					<KeyHint hotkey={'^C'} description={'Exit'} />
					<KeyHint hotkey={'^E'} description={'Export'} />
					<KeyHint hotkey={'E'} description={'Edit selected file'} />
					<KeyHint hotkey={'↑'} description={'move selection up'} />
					<KeyHint hotkey={'↓'} description={'move selection down'} />
				</Box>
			</Box>);
	}
}
