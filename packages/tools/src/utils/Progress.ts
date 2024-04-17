import cliProgress from 'cli-progress';

export function createMultiProgress() {
	return new cliProgress.MultiBar({
		format: createProgressFormat(),
		stopOnComplete: true,
		clearOnComplete: false,
		hideCursor: true,
	}, cliProgress.Presets.shades_classic);
}

export function createProgressFormat(options?: Partial<{ name: string, extra: string }>) {
	return `${options?.name ? `|-| ${options.name} ` : ''}|{bar}| {percentage}% || Duration: {duration_formatted} || ETA: {eta_formatted} || {value}/{total}${options?.extra ? ` || ${options.extra}` : ''}`
}