import { Button } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { IOnProgress } from 'ipmc-interfaces';
import React, { useEffect, useMemo } from 'react';
import { Loader } from '../atoms';
import { Check, ErrorOutlined } from '@mui/icons-material';

export function ActionButton(props: { action: (options: IActionOptions) => Promise<void>; children: React.ReactElement; }) {
	const { action, children } = props;

	const status = useSignal<TButtonState>('idle');
	const progress = useSignal<number | undefined>(undefined);
	const icon = useComputed(() => {
		switch (status.value) {
			case 'idle':
				return '';
			case 'loading':
				return (
					<Loader progress={progress.value} total={1} size={25} />
				);
			case 'success':
				return (
					<Check />
				);
			case 'error':
				return (
					<ErrorOutlined />
				);
		}
	});

	// Abort running actions on unload.
	const abortController = useMemo(() => new AbortController(), []);
	useEffect(() => (() => abortController.abort()), []);

	return useComputed(() => (
		<Button
			endIcon={icon.value}
			disabled={status.value === 'loading'}
			onClick={() => {
				if (status.value !== 'loading') {
					status.value = 'loading';
					action({
						onProgress: (n, t) => {
							progress.value = n / (t ?? 100);
						},
						signal: abortController.signal,
					})
						.then(() => {
							status.value = 'success';
						})
						.catch((e: any) => {
							status.value = 'error';
							return Promise.reject(e);
						})
						.finally(() => {
							progress.value = 0;
						});
				}
			}}
		>
			{children}
		</Button>
	));
}

export interface IActionOptions {
	signal: AbortSignal,
	onProgress: IOnProgress,
}

type TButtonState = 'idle' | 'loading' | 'error' | 'success';
