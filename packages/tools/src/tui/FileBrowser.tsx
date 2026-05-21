import { Box, Text, useInput } from 'ink';
import React, { useEffect, useState } from 'react';
import fs from 'fs/promises';
import { join, normalize } from 'path';

export type IFileInfo = {
	name: string;
	isDirectory: boolean;
};

let dir = process.cwd();

export function FileBrowser(props: { onSubmit?: (path: string) => void; }) {
	const [path, setPath] = useState(dir);
	const [index, setIndex] = useState(-1);
	const [files, setFiles] = useState<IFileInfo[]>([]);

	useEffect(() => {
		dir = path;
		fs.readdir(path)
			.then(async (r) => {
				const files: IFileInfo[] = [];
				for (const n of r) {
					try {
						const stat = await fs.stat(join(path, n));
						files.push({
							name: n,
							isDirectory: stat.isDirectory(),
						});
					} catch (_) {
						//ingore errors
					}
				}
				setFiles(files);
			});
	}, [path]);

	useInput((input, key) => {
		if (key.downArrow && index < files.length - 1) {
			setIndex(index + 1);
		}

		if (key.upArrow && index > 0) {
			setIndex(index - 1);
		}

		if (key.rightArrow) {
			const fn = join(path, files[index].name);
			if (files[index].isDirectory) {
				setIndex(-1);
				setPath(fn);
			} else {
				props.onSubmit && props.onSubmit(fn);
			}
		}

		if (key.leftArrow) {
			setIndex(-1);
			setPath(join(path, '..'));
		}
	});

	return (
		<Box flexDirection={'column'}>
			<Text>{path}</Text>
			<Box flexDirection={'column'}>
				{files.map((f, i) => (
					<Box
						key={path + f.name}
						backgroundColor={index === i ? 'greenBright' : (i % 2 == 0 ? 'gray' : 'black')}
						flexDirection={'row'}
					>
						<Text>{f.name}</Text>
					</Box>
				)).slice(Math.max(index - 5, 0), Math.max(index - 5, 0) + 10)}
			</Box>
		</Box>
	);
}
