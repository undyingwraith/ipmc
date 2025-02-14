interface ISpacerProps {
	width?: number | string;
	height?: number | string;
}

export function Spacer(props: ISpacerProps) {
	return <div style={{ flexGrow: 1, minWidth: props.width ?? 0, minHeight: props.height ?? 0 }} />;
}
