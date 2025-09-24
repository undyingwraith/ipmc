import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Grid } from 'react-window';
import { useLocation } from 'wouter';
import { Display, ErrorBoundary, FileGridItem } from '../molecules';

export function FileGrid(props: { files: IFileInfo[]; display: ReadonlySignal<Display>; }) {
	const { files, display } = props;

	const [_, setLocation] = useLocation();

	return (
		<AutoSizer>
			{({ width, height }) => {
				const finalWidth = width - 10;
				const isMobile = finalWidth < 640;
				const cardWidth = isMobile ? 150 : 240;
				const cardHeight = isMobile ? 550 : 650;

				const columnCount = Math.floor(finalWidth / cardWidth);
				const rowCount = Math.ceil(files.length / columnCount);

				const wastedSpace = finalWidth - (cardWidth * columnCount);
				const finalCardWidth = cardWidth + Math.floor(wastedSpace / columnCount);

				return (
					<div style={{ height: height, width: width }}>
						<Grid
							style={{ margin: '0 auto', padding: 5 }}
							cellProps={{ files }}
							cellComponent={({ files, rowIndex, columnIndex, style }) => {
								const f = files[(rowIndex * columnCount) + columnIndex];
								return (
									<ErrorBoundary key={f?.cid}>
										<div
											style={{
												...style,
												padding: 5,
											}}
										>
											<FileGridItem
												file={f}
												onOpen={() => setLocation(`/${f.name}`)}
												display={display}
											/>
										</div>
									</ErrorBoundary>
								);
							}}
							columnCount={columnCount}
							rowCount={rowCount}
							columnWidth={finalCardWidth}
							rowHeight={cardHeight}
						/>
					</div>
				);
			}}
		</AutoSizer>
	);
}
