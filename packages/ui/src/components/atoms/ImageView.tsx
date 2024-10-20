import React from "react";
import { useFileUrl } from "../../hooks/useFileUrl";

export function ImageView(props: { cid: string; }) {
	const url = useFileUrl(props.cid);
	return <img src={url.value} />;
}
