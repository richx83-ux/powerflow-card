/**
 * Stroke line-art icons for photo glass tiles (solar / grid / battery)
 * plus a shared HTML renderer for load-split glyphs.
 */
import { html, TemplateResult, svg } from 'lit';
import {
	loadSplitIcons,
	type LoadSplitSvgKind,
	type LoadSplitPath,
} from './load-split-icons';

export type PhotoTileIconKind =
	LoadSplitSvgKind | 'solar' | 'grid' | 'battery' | 'load';

type IconDef = { paths: LoadSplitPath[] };

const STROKE = 1.15;

const CORE_ICONS: Record<'solar' | 'grid' | 'battery' | 'load', IconDef> = {
	solar: {
		paths: [
			{ d: 'M12 3.2v2.2', strokeWidth: STROKE },
			{ d: 'M12 18.6v2.2', strokeWidth: STROKE },
			{ d: 'M4.2 12H2', strokeWidth: STROKE },
			{ d: 'M22 12h-2.2', strokeWidth: STROKE },
			{ d: 'M5.9 5.9l1.55 1.55', strokeWidth: STROKE },
			{ d: 'M16.55 16.55l1.55 1.55', strokeWidth: STROKE },
			{ d: 'M5.9 18.1l1.55-1.55', strokeWidth: STROKE },
			{ d: 'M16.55 7.45l1.55-1.55', strokeWidth: STROKE },
			{
				d: 'M12 7.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8z',
				strokeWidth: STROKE,
			},
		],
	},
	grid: {
		paths: [
			{ d: 'M4 20V7.5L12 3.5l8 4V20', strokeWidth: STROKE },
			{ d: 'M4 20h16', strokeWidth: STROKE },
			{ d: 'M8.2 20v-5.2h7.6V20', strokeWidth: STROKE },
			{ d: 'M8.2 11.2h7.6', strokeWidth: STROKE },
			{ d: 'M12 7.4v3.8', strokeWidth: STROKE },
			{ d: 'M9.5 14.8h.01M14.5 14.8h.01', strokeWidth: 1.6 },
		],
	},
	battery: {
		paths: [
			{ d: 'M7.2 6.2h9.6v13.2H7.2z', strokeWidth: STROKE },
			{ d: 'M10 4.2h4v2', strokeWidth: STROKE },
			{ d: 'M9.2 16.6h5.6', strokeWidth: 1 },
			{ d: 'M9.2 13.8h5.6', strokeWidth: 1 },
			{ d: 'M9.2 11h5.6', strokeWidth: 1 },
		],
	},
	load: {
		paths: [
			{
				d: 'M12 3.5L4.5 13.2h5.2L8.2 20.5 19.5 10.2h-5.4L16.2 3.5z',
				strokeWidth: STROKE,
			},
		],
	},
};

function pathsFor(kind: PhotoTileIconKind): LoadSplitPath[] {
	if (kind in CORE_ICONS) {
		return CORE_ICONS[kind as keyof typeof CORE_ICONS].paths;
	}
	return loadSplitIcons[kind as LoadSplitSvgKind]?.paths || [];
}

function renderPaths(paths: LoadSplitPath[], colour: string) {
	return paths.map((p) => {
		const mode = p.mode || 'stroke';
		if (mode === 'fill') {
			return svg`
				<path
					fill="${colour}"
					fill-rule="${p.fillRule || 'nonzero'}"
					d="${p.d}"
				/>
			`;
		}
		return svg`
			<path
				fill="none"
				stroke="${colour}"
				stroke-width="${p.strokeWidth ?? 1.15}"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="${p.d}"
			/>
		`;
	});
}

/** Inline SVG icon for HTML glass tiles. */
export function renderPhotoTileIcon(
	kind: PhotoTileIconKind | null | undefined,
	colour: string,
	size = 28,
): TemplateResult {
	const paths = kind ? pathsFor(kind) : [];
	if (!paths.length) {
		return html``;
	}
	return html`
		<svg
			class="pf-photo-icon"
			xmlns="http://www.w3.org/2000/svg"
			width="${size}"
			height="${size}"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			${renderPaths(paths, colour)}
		</svg>
	`;
}
