import React from "react";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { Button } from "@mui/material";
import { IIpfsService } from "../../service";

export function ConnectionStatus(props: { ipfs: IIpfsService }) {
	const peers = useSignal<string[]>([])

	useSignalEffect(() => {
		const i = setInterval(() => {
			props.ipfs.peers()
				.then(r => {
					peers.value = r;
				})
				.catch(console.error);
		}, 5000);

		return () => {
			clearInterval(i);
		}
	});

	return useComputed(() => (
		<Button>{peers.value.length}</Button>
	));
}