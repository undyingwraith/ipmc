import React from "react";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { Button } from "@mui/material";
import { IIpfsService } from "../../service";

export function ConnectionStatus(props: { ipfs: IIpfsService; }) {
	const peers = useSignal<string[]>([]);

	useSignalEffect(() => {
		const updatePeers = () => {
			props.ipfs.peers()
				.then(r => {
					peers.value = r;
				})
				.catch(console.error);
		};
		const i = setInterval(updatePeers, 5000);
		updatePeers();

		return () => {
			clearInterval(i);
		};
	});

	return useComputed(() => (
		<Button onClick={() => console.log(peers.value)}>{peers.value.length}</Button>
	));
}
