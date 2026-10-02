import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/**/*.{jpeg,jpg,png,gif,webp,avif,svg}',
	{ eager: true },
);

function normalizeAssetPath(src: string): string {
	let path = src.trim();
	// Strip query/hash fragments from CMS or imagetools-style URLs
	path = path.split('?')[0].split('#')[0];
	// Normalize common prefixes to /src/assets/...
	path = path
		.replace(/^~\//, '/')
		.replace(/^\/?src\/assets\//, '/src/assets/')
		.replace(/^\/assets\//, '/src/assets/')
		.replace(/^assets\//, '/src/assets/');
	if (!path.startsWith('/') && !path.startsWith('/src/assets/')) {
		path = path.startsWith('src/assets/') ? `/${path}` : `/src/assets/${path.replace(/^\//, '')}`;
	}
	return path;
}

export function resolveAsset(src?: string | null): ImageMetadata | undefined {
	if (!src) return undefined;

	const normalized = normalizeAssetPath(src);
	const filename = normalized.split('/').pop() || '';
	const basename = filename.replace(/\.[^.]+$/, '');

	const candidates = new Set<string>([
		normalized,
		`/src/assets/${filename}`,
		src,
		filename,
	]);

	for (const [key, mod] of Object.entries(modules)) {
		const keyFile = key.split('/').pop() || '';
		const keyBase = keyFile.replace(/\.[^.]+$/, '');

		for (const c of candidates) {
			if (key === c) return mod.default;
			if (key.endsWith(c.replace(/^\/src\/assets\//, ''))) return mod.default;
			if (c.endsWith(keyFile) || key.endsWith(`/${filename}`) || key.endsWith(filename)) {
				return mod.default;
			}
		}

		// Match by basename so foo.jpeg resolves even if extension casing differs
		if (basename && keyBase.toLowerCase() === basename.toLowerCase()) {
			return mod.default;
		}
		if (filename && keyFile.toLowerCase() === filename.toLowerCase()) {
			return mod.default;
		}
	}

	return undefined;
}

export function assetEntries() {
	return Object.entries(modules).map(([path, mod]) => {
		const file = path.split('/').pop() || '';
		return {
			path,
			src: `/src/assets/${file}`,
			name: file.replace(/\.[^.]+$/, ''),
			image: mod.default,
			format: mod.default.format,
		};
	});
}
