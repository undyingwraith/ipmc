import { Button, IconButton } from '@mui/material';
import { ReadonlySignal, Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import React, { PropsWithChildren } from 'react';
import styles from './DropDown.module.scss';

export interface IDropDownProps {
	icon: any;
	visible?: Signal<boolean>;
	text?: string | ReadonlySignal<string>;
	align?: 'left' | 'right';
}

export function DropDown(props: PropsWithChildren<IDropDownProps>) {
	const localVisible = useSignal(false);
	const visible = props.visible ?? localVisible;

	const containerRef = useSignal<HTMLDivElement | null>(null);

	useSignalEffect(() => {
		const ref = containerRef.value;
		if (ref) {
			window.addEventListener('click', (ev) => {
				if (ev.target && !ref.contains(ev.target as any)) {
					visible.value = false;
				}
			});
		}
	});

	return (
		<div
			className={styles.container}
			ref={r => containerRef.value = r}
		>
			{props.text ? (
				<Button startIcon={props.icon} onClick={() => visible.value = !visible.value}>
					{props.text}
				</Button>
			) : (
				<IconButton onClick={() => visible.value = !visible.value}>
					{props.icon}
				</IconButton>
			)}
			{useComputed(() => !visible.value ? undefined : (
				<div
					className={styles.dropDown}
					style={props.align === 'right' ? { right: 0 } : undefined}
				>
					{props.children}
				</div>
			))}
		</div>
	);
}
