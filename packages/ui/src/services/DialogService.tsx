import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { computed, Signal } from '@preact/signals';
import { inject, injectable } from 'inversify';
import { IDialogOptions, IDialogService, IFileDialogOptions, type IPopupService, IPopupServiceSymbol, type ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { FileInput, TextInput } from '../components/atoms';

@injectable()
export class DialogService implements IDialogService {
	constructor(
		@inject(IPopupServiceSymbol) private popupService: IPopupService,
		@inject(ITranslationServiceSymbol) private translationService: ITranslationService,
	) { }

	boolDialog(options: IDialogOptions): Promise<boolean> {
		let ok = false;
		return this.popupService.show({
			closeOnOutsideClick: false,
			content: (close) => (
				<Card>
					<CardHeader title={options.title} />
					<CardContent>
					</CardContent>
					<CardActions>
						<Button
							onClick={close}
						>{options.cancelButtonText ?? this.translationService.translate('Cancel')}</Button>
						<Button
							onClick={() => {
								ok = true;
								close();
							}}
						>{options.okButtonText ?? this.translationService.translate('Ok')}</Button>
					</CardActions>
				</Card>
			)
		})
			.then(() => {
				return ok;
			});
	}

	stringDialog(options: IDialogOptions): Promise<string> {
		const signal = new Signal<string>(); let closeDialog = () => { };
		return new Promise<string>((resolve, reject) => {
			void this.popupService.show({
				closeOnOutsideClick: false,
				content: (close) => {
					closeDialog = close;
					return (
						<Card>
							<CardHeader title={options.title} />
							<CardContent>
								<TextInput
									value={signal}
								/>
							</CardContent>
							<CardActions>
								<Button
									onClick={() => reject()}
								>
									{options.cancelButtonText ?? this.translationService.translate('Cancel')}
								</Button>
								{computed(() => (
									<Button
										onClick={() => resolve(signal.value)}
										disabled={signal.value.length <= 0}
									>
										{options.okButtonText ?? this.translationService.translate('Ok')}
									</Button>
								))}
							</CardActions>
						</Card>
					);
				}
			});
		})
			.finally(() => {
				closeDialog();
			});
	}

	fileDialog(options: IFileDialogOptions): Promise<any> {
		const signal = new Signal<File[]>([]);
		let closeDialog = () => { };
		return new Promise((resolve, reject) => {
			void this.popupService.show({
				closeOnOutsideClick: false,
				content: (close) => {
					closeDialog = close;
					return (
						<Card>
							<CardHeader title={options.title} />
							<CardContent>
								<FileInput
									accept={options.accept}
									value={signal}
								/>
							</CardContent>
							<CardActions>
								<Button
									onClick={() => reject()}
								>
									{options.cancelButtonText ?? this.translationService.translate('Cancel')}
								</Button>
								{computed(() => (
									<Button
										onClick={() => resolve(signal.value)}
										disabled={signal.value.length <= 0}
									>
										{options.okButtonText ?? this.translationService.translate('Ok')}
									</Button>
								))}
							</CardActions>
						</Card>
					);
				}
			});
		})
			.finally(() => {
				closeDialog();
			});
	}
}
