import React from 'react';
import { minidenticon } from 'minidenticons';

export function Identicon(props: { value: string; }) {
	return <img src={'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(props.value))} width={25} height={25} />;
}
