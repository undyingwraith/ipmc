import { Paper, Toolbar } from "@mui/material";
import { useService } from '../../context';
import { AppbarButtonService, AppbarButtonServiceSymbol } from '../../services';
import { Spacer } from '../atoms';

export function AppBar(props: {
	elevation?: number;
}) {
	const appbarService = useService<AppbarButtonService>(AppbarButtonServiceSymbol);

	return (
		<Paper elevation={props.elevation ?? 0} sx={{ borderRadius: 0 }}>
			<Toolbar>
				{appbarService.startButtons}
				<Spacer width={15} />
				{appbarService.endButtons}
			</Toolbar>
		</Paper>
	);
}
