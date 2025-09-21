import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Grid } from 'react-window';
import { useLocation } from 'wouter';
import { Display, ErrorBoundary, FileGridItem } from '../../molecules';

export function FileGrid(props: { files: IFileInfo[]; display: ReadonlySignal<Display>; }) {
	const { files, display } = props;

	const [_, setLocation] = useLocation();

	return (
		<AutoSizer>
			{({ width, height }) => {
				const cardWidth = 286;
				const cardHeight = 395;
				const columnCount = Math.floor(width / cardWidth);
				const rowCount = Math.ceil(files.length / columnCount);

				//TODO: spacing

				return (
					<div style={{ height: height, width: width, margin: '0 auto' }}>
						<Grid
							cellProps={{ files }}
							cellComponent={({ files, rowIndex, columnIndex, style }) => {
								const f = files[(rowIndex * columnCount) + columnIndex];
								return (
									<ErrorBoundary key={f?.cid}>
										<FileGridItem
											style={style}
											file={f}
											onOpen={() => setLocation(`/${f.name}`)}
											display={display}
										/>
									</ErrorBoundary>
								);
							}}
							columnCount={columnCount}
							rowCount={rowCount}
							columnWidth={cardWidth}
							rowHeight={cardHeight}
						/>
					</div>
				);
			}}
		</AutoSizer>
	);
}
