import { AspectRatio, HourglassFull } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { Signal } from '@preact/signals-react';
import React from 'react';
import { TimeDisplay } from './TimeDisplay';
import { IVideoFile } from 'ipmc-interfaces';

export function VideoMetadataDisplay(props: { file: IVideoFile; }) {
	const { file } = props;
	return (
		<div style={{ display: 'flex', gap: 5 }}>
			<Chip
				size={'small'}
				icon={<HourglassFull />}
				label={<TimeDisplay time={new Signal(file.duration)} />}
			/>
			<Chip
				size={'small'}
				icon={<AspectRatio />}
				label={
					file.resolution < 720 ? 'SD'
						: file.resolution < 1080 ? 'HD'
							: file.resolution < 1440 ? 'FHD'
								: file.resolution < 2160 ? 'QHD'
									: file.resolution < 1440 ? '4k'
										: '8k'
				}
			/>
		</div>
	);
}
