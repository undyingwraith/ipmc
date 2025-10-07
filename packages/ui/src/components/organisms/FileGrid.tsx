import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Grid } from 'react-window';
import { useLocation } from 'wouter';
import { Display, ErrorBoundary, FileGridItem } from '../molecules';

function getScrollbarWidth() {
	// Creating invisible container
	const outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.overflow = 'scroll'; // forcing scrollbar to appear
	document.body.appendChild(outer);

	// Creating inner element and placing it in the container
	const inner = document.createElement('div');
	outer.appendChild(inner);

	// Calculating difference between container's full width and the child width
	const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

	// Removing temporary elements from the DOM
	outer.parentNode?.removeChild(outer);

	return scrollbarWidth;
}

export function FileGrid(props: { files: IFileInfo[]; display: ReadonlySignal<Display>; }) {
	const { files, display } = props;

	const [_, setLocation] = useLocation();

	return useComputed(() => {
		const isPoster = display.value === Display.Poster;

		return (
			<AutoSizer>
				{({ width, height }) => {
					const finalWidth = width - 10 - getScrollbarWidth();
					const isMobile = finalWidth < 640;
					const cardWidth = isMobile ? 150 : 240;

					const columnCount = Math.floor(finalWidth / cardWidth);
					const rowCount = Math.ceil(files.length / columnCount);

					const wastedSpace = finalWidth - (cardWidth * columnCount);
					const finalCardWidth = cardWidth + Math.floor(wastedSpace / columnCount);

					const cardHeight = finalCardWidth * (isPoster ? 1.5 : 0.6) + 230;


					return (
						<div style={{ height: height, width: width }}>
							<Grid
								style={{ margin: '0 auto', padding: 5 }}
								cellProps={{ files }}
								cellComponent={({ files, rowIndex, columnIndex, style }) => {
									const index = (rowIndex * columnCount) + columnIndex;
									if (index >= files.length) {
										return undefined;
									}
									const f = files[index];
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
	});
}
