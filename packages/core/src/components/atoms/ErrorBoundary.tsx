import { Alert } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export class ErrorBoundary extends React.Component<PropsWithChildren<{}>, { hasError: boolean; }> {
	constructor(props: PropsWithChildren<{}>) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: any) {
		console.error(error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Alert severity="error">Error</Alert>
			);
		}

		return this.props.children;
	}
}
