import { Button, ButtonGroup } from '@mui/material';
import { ReadonlySignal, Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import Color from 'color';
import React from 'react';
import { useTranslation } from '../../../hooks';
import styles from './ColorPicker.module.scss';

export function ColorPicker(props: {
	label?: string | ReadonlySignal<string>;
	value: Signal<string>;
	instant?: boolean;
	default?: string;
}) {
	const { value, label, instant } = props;
	const color = Color(value.value).hsl().object();

	const _t = useTranslation();

	const containerRef = useSignal<HTMLDivElement | null>(null);
	const hue = useSignal<number>(color.h);
	const saturation = useSignal<number>(color.s);
	const lightness = useSignal<number>(color.l);
	const hslString = useComputed(() => `hsl(${hue.value}, ${saturation.value}%, ${lightness.value}%)`);

	function setComponents() {
		const color = Color(value.value).hsl().object();
		hue.value = color.h;
		saturation.value = color.s;
		lightness.value = color.l;
	}

	// Update --hue css var
	useSignalEffect(() => {
		if (containerRef.value) {
			const style = containerRef.value.style;
			style.setProperty('--hue', hue.value.toString());
		}
	});

	// Update picker values if value changes 
	useSignalEffect(setComponents);

	// Update value if picker values change
	useSignalEffect(() => {
		if (instant) {
			value.value = hslString.value;
		}
	});

	return (
		<div>
			{label && <span>{label}</span>}
			<div className={styles.container} ref={r => containerRef.value = r}>
				{useComputed(() => (
					<div
						className={styles.preview}
						style={{ backgroundColor: hslString.value }}
					/>
				))}
				<div>
					{useComputed(() => (<>
						<input
							type='number'
							min={0}
							max={359}
							value={hue.value}
							onChange={(ev) => hue.value = parseInt(ev.target.value)}
						/>
						<input
							type='range'
							min={0}
							max={359}
							step={1}
							value={hue.value}
							onChange={(ev) => hue.value = parseInt(ev.target.value)}
						/>
					</>))}
				</div>

				<div>
					{useComputed(() => (<>
						<input
							type='number'
							min={0}
							max={100}
							value={saturation.value}
							onChange={(ev) => saturation.value = parseInt(ev.target.value)}
						/>
						<input
							type='range'
							min={0}
							max={100}
							step={1}
							value={saturation.value}
							onChange={(ev) => saturation.value = parseInt(ev.target.value)}
						/>
					</>))}
				</div>

				<div>
					{useComputed(() => (<>
						<input
							type='number'
							min={0}
							max={100}
							value={lightness.value}
							onChange={(ev) => lightness.value = parseInt(ev.target.value)}
						/>
						<input
							type='range'
							min={0}
							max={100}
							step={1}
							value={lightness.value}
							onChange={(ev) => lightness.value = parseInt(ev.target.value)}
						/>
					</>))}
				</div>

				{!instant && (
					<div>
						<ButtonGroup>
							<Button
								onClick={setComponents}
							>{_t('Reset')}</Button>
							{props.default && (
								<Button
									color='info'
									onClick={() => {
										value.value = props.default!;
										setComponents();
									}}
								>{_t('Default')}</Button>
							)}
							<Button
								onClick={() => {
									value.value = hslString.value;
								}}
							>{_t('Apply')}</Button>
						</ButtonGroup>
					</div>
				)}
			</div>
		</div>
	);
}
