import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { Display, ErrorBoundary, FileGridItem } from '../../molecules';
import styles from './FileGrid.module.css';

export function FileGrid(props: { files: IFileInfo[]; display: ReadonlySignal<Display>; }) {
	const { files, display } = props;

	const [_, setLocation] = useLocation();

	return (
		<div className={styles.container}>
			{files.map(i => (
				<div className={styles.item} key={i.cid}>
					<ErrorBoundary>
						<FileGridItem
							file={i}
							onOpen={() => setLocation(`/${i.name}`)}
							display={display}
						/>
					</ErrorBoundary>
				</div>
			))}
			<div className={styles.item} />
			<div className={styles.item} />
			<div className={styles.item} />
			<div className={styles.item} />
			<div className={styles.item} />
		</div>
	);
}
