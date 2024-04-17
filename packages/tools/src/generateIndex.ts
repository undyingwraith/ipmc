import { IPFSHTTPClient } from "kubo-rpc-client/types";
import { IMetaData, extractMetaData } from "./utils/MetaData";
import { createMultiProgress } from "./utils/Progress";

export interface IIndexOptions {
	pageSize?: number;
	pageStyle: 'poster' | 'thumbnail';
}

const MaxFileNameLength = 20;

export async function generateIndex(ipfs: IPFSHTTPClient, path: string) {
	const progress = createMultiProgress();
	progress.log(`Generating index of '${path}'`);
	const main = progress.create(3, 0, { step: 'Loading directory...' }, {
		format: '|{bar}| {percentage}% || {value}/{total} Steps || Duration: {duration_formatted}',
	});
	
	const fetchProgress = progress.create(1, 0, {}, {
		format: '|-| Fetching files |{bar}| {percentage}% || ETA: {eta_formatted}',
	});
	const files: any[] = []
	for await (const video of ipfs.files.ls(path)) {
		if (video.type == 'directory') {
			files.push(video);
		}
	}
	fetchProgress.update(1);

	main.update(1);

	const fileProgress = progress.create(files.length, 0, { file: '?' }, {
		format: '|-| Extracting metadata |{bar}| {percentage}% || ETA: {eta_formatted} || {value}/{total} Files || {file}',
	});
	const items: IMetaData[] = []
	for (const video of files) {
		fileProgress.update({ file: video.name.length > MaxFileNameLength ? video.name.substring(0, MaxFileNameLength) : video.name});
		items.push(await extractMetaData(ipfs, video));
		fileProgress.increment();
	}

	main.update(2);

	const opt: IIndexOptions = {
		pageStyle: 'thumbnail',
		pageSize: 25,
	}

	const pages = opt.pageSize == undefined ? 1 : Math.ceil(items.length / opt.pageSize);

	const pageProgress = progress.create(pages, 0, {}, {
		format: '|-| Generating pages |{bar}| {percentage}% || ETA: {eta_formatted} || {value}/{total} Pages',
	});

	for (let page = 0; page < pages; page++) {
		const start = opt.pageSize == undefined ? 0 : opt.pageSize * page;
		const end = opt.pageSize == undefined ? items.length : start + opt.pageSize;
		const result = generatePage(items.slice(start, end), opt, generatePaging(page, pages));
		await ipfs.files.write(`${path}/index${page == 0 ? '' : page}.html`, new TextEncoder().encode(result), {
			create: true,
			truncate: true,
		});
		pageProgress.increment();
	}


	main.update(3);
	progress.stop();
}

function generatePage(items: IMetaData[], opt: IIndexOptions, pagingInfo?: string): string {
	const body = items.map(i => opt.pageStyle == 'poster' ? `<a href="${encodeURIComponent(i.video.path)}" style="display: inline-block;">
	<img src="${encodeURIComponent(i.posters[0].path)}" style="width: 100%"/>
	<p style="overflow: ellipsis;" title="${i.title}">${i.title}</p>
</a>` : `<a href="${encodeURIComponent(i.title)}/${encodeURIComponent(i.video.name)}" style="display: inline-block; width: 640px">
	<img src="${encodeURIComponent(i.title)}/${encodeURIComponent(i.thumbnails[0]?.name)}" style="width: 100%"/>
	<p style="overflow: ellipsis; width: 100%;" title="${i.title}">${i.title}</p>
</a>`).join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8"/>
</head>
<body>
	${pagingInfo == undefined ? '' : pagingInfo}
	<div style="display: flex; flex-wrap: wrap; justify-content: center;">
		${body}
	</div>
	${pagingInfo == undefined ? '' : pagingInfo}
</body>
</html>`;
}

function generatePaging(page: number, pages: number) {
	const links: string[] = [];


	for (let p = 0; p < pages; p++) {
		if (p < page - 5) {
			continue;
		}
		if (links.length >= 10) {
			break;
		}
		links.push(`<button onclick="window.location.href='./index${p == 0 ? '' : p}.html'" style="padding: 5px;${page == p ? ' color:red;' : ''}">${p + 1}</button>`);
	}

	if (pages >= 10) {
		if (page - 5 >= 0) {
			links.unshift('...');
		}
		links.unshift(`<button onclick="window.location.href='./index${page - 1 <= 0 ? '' : page - 1}.html'" style="padding: 5px;"  ${page == 0 ? 'disabled' : ''}>&lt;</button>`);
		links.unshift(`<button onclick="window.location.href='./index.html'" style="padding: 5px;" ${page == 0 ? 'disabled' : ''}>|&lt;</button>`);

		if (page + 5 <= pages) {
			links.push('...');
		}
		links.push(`<button onclick="window.location.href='./index${page + 1 >= pages ? pages - 1 : page + 1}.html';" ${page + 1 == pages ? 'disabled' : ''}>&gt;</button>`);
		links.push(`<button onclick="window.location.href='./index${pages - 1}.html';" ${page + 1 == pages ? 'disabled' : ''}>&gt;|</button>`);
	}

	return pages == 1 ? undefined : `<div style="display: flex; justify-content: center;">
${links.join('')}
</div>`;
}
