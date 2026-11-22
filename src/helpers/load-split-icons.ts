/**
 * Original stroke line-art icons for house/cars load split (mockup style).
 *
 * Thin outline glyphs on dark HA dashboards — not solid fills. Wired by load
 * id (tesla, puma, heat_pump, sunamp). No brand logos. Legacy MDI remaps;
 * image URLs still override.
 */

export type LoadSplitSvgKind =
	| 'car'
	| 'tesla'
	| 'puma'
	| 'house'
	| 'heat_pump'
	| 'tank';

export type LoadSplitPath = {
	d: string;
	/** Default: stroke line-art. Set fill for rare solid accents. */
	mode?: 'stroke' | 'fill';
	fillRule?: 'evenodd' | 'nonzero';
	/** Stroke width in viewBox units (default 1.15). */
	strokeWidth?: number;
};

export type LoadSplitIconDef = {
	paths: LoadSplitPath[];
	mdiFallback: string;
};

const STROKE = 1.15;

/**
 * Thin stroke silhouettes (viewBox 0 0 24 24), tuned for ~22–28px.
 * Style matches the expected mockup: outline cars, house with panes,
 * outdoor HP + indoor, banded thermal store.
 */
export const loadSplitIcons: Record<LoadSplitSvgKind, LoadSplitIconDef> = {
	/** Cars hub — outline EV hatch (generic). */
	car: {
		mdiFallback: 'mdi:car-side',
		paths: [
			{
				d:
					'M2.5 14.3h1l.35-1.65c.25-1.05 1.05-1.85 2.05-2.15L9 9.55c1-.35 2.1-.4 3.1-.1' +
					'l3 .65c1.05.25 1.85 1 2.25 1.95l.8 1.85h1.15c.45 0 .8.35.85.8l.1 1' +
					'c.05.35-.25.65-.6.65h-.65M20.55 16.35h.65M3.5 16.35H2.55c-.4 0-.75-.3-.75-.7' +
					'v-.85c0-.4.3-.7.7-.7',
				strokeWidth: STROKE,
			},
			{
				d: 'M8.55 9.9l2.65-.65c.7-.15 1.4-.15 2.05.05l2.05.5-.5 1.5H9.15l-.6-1.4z',
				strokeWidth: STROKE,
			},
			{ d: 'M4.6 16.3h4.4M13.7 16.3h4.3', strokeWidth: STROKE },
			{
				d: 'M6.7 15.35a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7z',
				strokeWidth: STROKE,
			},
			{
				d: 'M16.15 15.35a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7z',
				strokeWidth: STROKE,
			},
			{ d: 'M6.7 16.45v1.6M5.9 17.25h1.6', strokeWidth: 0.9 },
			{ d: 'M16.15 16.45v1.6M15.35 17.25h1.6', strokeWidth: 0.9 },
		],
	},

	/**
	 * Tesla Model Y — low sleek crossover, continuous fastback, long greenhouse.
	 */
	tesla: {
		mdiFallback: 'mdi:car-side',
		paths: [
			// body outer
			{
				d:
					'M2.4 14.4h1l.3-1.75C3.95 11.1 4.85 10.1 6.2 9.6L8.9 8.55' +
					'c1.25-.45 2.7-.5 4-.15l2.85.7c1.15.3 2 1 2.4 2.05l.75 1.85h1.35' +
					'c.4 0 .75.35.8.75l.15 1.2c.05.3-.2.55-.5.55h-.55',
				strokeWidth: STROKE,
			},
			{
				d: 'M2.4 14.4H1.75c-.35 0-.65.3-.65.65v.9c0 .3.25.55.55.55H2.4',
				strokeWidth: STROKE,
			},
			{
				d: 'M20.5 16.5h.55c.3 0 .55-.25.5-.55l-.15-1.2',
				strokeWidth: STROKE,
			},
			// rocker
			{ d: 'M4.5 16.4H9.2M13.6 16.4h4.5', strokeWidth: STROKE },
			// long sloping glass (Y)
			{
				d:
					'M8.35 9.55l3.05-.75c.8-.2 1.65-.15 2.4.2l1.95.8-.7 1.45' +
					'c-.1.2-.3.3-.5.3H9.15c-.35 0-.6-.3-.5-.65l-.3-1.35z',
				strokeWidth: STROKE,
			},
			// door seam + handle
			{ d: 'M12.15 10.9v4.9', strokeWidth: 1 },
			{ d: 'M13.35 13.35h.85', strokeWidth: 1 },
			// light cues
			{ d: 'M4.55 13.35h1.1', strokeWidth: 1 },
			{ d: 'M19.1 13.5h1', strokeWidth: 1 },
			// wheels + spokes
			{
				d: 'M6.85 15.45a1.95 1.95 0 1 1 0 3.9 1.95 1.95 0 0 1 0-3.9z',
				strokeWidth: STROKE,
			},
			{
				d: 'M16.35 15.45a1.95 1.95 0 1 1 0 3.9 1.95 1.95 0 0 1 0-3.9z',
				strokeWidth: STROKE,
			},
			{ d: 'M6.85 16.55v1.7M6 17.4h1.7', strokeWidth: 0.9 },
			{ d: 'M16.35 16.55v1.7M15.5 17.4h1.7', strokeWidth: 0.9 },
		],
	},

	/**
	 * Ford Puma — taller compact crossover, upright arched rear hatch.
	 */
	puma: {
		mdiFallback: 'mdi:car-side',
		paths: [
			{
				d:
					'M2.5 14.25h1.1l.25-1.45c.25-1.3 1.15-2.15 2.45-2.5L8.4 9.5' +
					'c.65-.2 1.35-.2 2 .05l1.55.4 1.7.2c.9.1 1.6.55 2.05 1.2l.5.7 1.2.2' +
					'c.75.1 1.3.7 1.3 1.45v.7h.5c.4 0 .75.3.75.75v.75c0 .4-.35.7-.75.7h-.5',
				strokeWidth: STROKE,
			},
			{
				d: 'M2.5 14.25H1.9c-.4 0-.75.3-.75.7v.85c0 .4.3.7.7.7h.65',
				strokeWidth: STROKE,
			},
			{
				d: 'M19.55 16.45h.5',
				strokeWidth: STROKE,
			},
			{ d: 'M4.6 16.35H9M13.4 16.35h4.2', strokeWidth: STROKE },
			// taller cabin + arched rear window
			{
				d:
					'M8.15 9.95l2.35-.5c.55-.1 1.1-.05 1.6.15l1.25.45' +
					'c.5.2.85.55 1.05 1l.3.7-1.35.35-.2-.55c-.1-.25-.35-.4-.6-.4H9' +
					'c-.35 0-.6-.3-.5-.65l-.35-1.55z',
				strokeWidth: STROKE,
			},
			// C-pillar / rear hatch hint
			{ d: 'M15.35 11.35l1.05 2.35', strokeWidth: 1 },
			{ d: 'M11.9 10.85v4.7', strokeWidth: 1 },
			{ d: 'M12.95 13.2h.75', strokeWidth: 1 },
			{ d: 'M4.7 13.2h1', strokeWidth: 1 },
			{ d: 'M18.35 13.45h.85', strokeWidth: 1 },
			{
				d: 'M6.7 15.4a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7z',
				strokeWidth: STROKE,
			},
			{
				d: 'M15.85 15.4a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7z',
				strokeWidth: STROKE,
			},
			{ d: 'M6.7 16.45v1.6M5.9 17.25h1.6', strokeWidth: 0.9 },
			{ d: 'M15.85 16.45v1.6M15.05 17.25h1.6', strokeWidth: 0.9 },
		],
	},

	/** House hub — outline home with chimney, door, paned windows. */
	house: {
		mdiFallback: 'mdi:home-outline',
		paths: [
			// roof + walls
			{
				d: 'M3 11.2L12 3.5l9 7.7',
				strokeWidth: STROKE,
			},
			{
				d: 'M5 10.9V20h14V10.9',
				strokeWidth: STROKE,
			},
			// chimney
			{ d: 'M16.2 7.2V4.6h2.2V8.9', strokeWidth: STROKE },
			// door
			{ d: 'M10.6 20v-5.2h2.8V20', strokeWidth: STROKE },
			{ d: 'M12.9 17.4h.35', strokeWidth: 1 },
			// ground windows (4-pane)
			{ d: 'M6.2 12.4h3.2v3.2H6.2z', strokeWidth: 1 },
			{ d: 'M6.2 14h3.2M7.8 12.4v3.2', strokeWidth: 0.85 },
			{ d: 'M14.6 12.4h3.2v3.2h-3.2z', strokeWidth: 1 },
			{ d: 'M14.6 14h3.2M16.2 12.4v3.2', strokeWidth: 0.85 },
			// attic window
			{ d: 'M10.7 7.35h2.6v2.2h-2.6z', strokeWidth: 1 },
			{ d: 'M10.7 8.45h2.6M12 7.35v2.2', strokeWidth: 0.85 },
		],
	},

	/**
	 * Heat pump — outdoor condenser (fan + louvers) + small indoor/wall unit.
	 */
	heat_pump: {
		mdiFallback: 'mdi:heat-pump',
		paths: [
			// outdoor cabinet
			{ d: 'M2.8 4.2h14.2v15.2H2.8z', strokeWidth: STROKE },
			// fan grille
			{ d: 'M9.9 6.35a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2z', strokeWidth: STROKE },
			{ d: 'M9.9 8.55a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8z', strokeWidth: 1 },
			// blades
			{ d: 'M9.9 7.2v1.2M9.9 12.5v1.2M7.15 10.45h1.2M11.45 10.45h1.2', strokeWidth: 0.95 },
			// lower louvers
			{ d: 'M4.5 15.6h10.8M4.5 16.85h10.8M4.5 18.1h10.8', strokeWidth: 1 },
			// feet
			{ d: 'M4.3 19.4v1.2M15.5 19.4v1.2', strokeWidth: STROKE },
			// indoor / wall unit (right)
			{ d: 'M18.2 7.5h3v7.2h-3z', strokeWidth: STROKE },
			{ d: 'M18.6 9.2h2.2M18.6 12.8h2.2', strokeWidth: 0.9 },
			// link pipe
			{ d: 'M17 11.1h1.2', strokeWidth: 1 },
		],
	},

	/** Sunamp-style banded cylindrical thermal store. */
	tank: {
		mdiFallback: 'mdi:propane-tank',
		paths: [
			// top stem / valve
			{ d: 'M11.35 1.5h1.3v1.6', strokeWidth: STROKE },
			{ d: 'M10.6 3.1h2.8', strokeWidth: STROKE },
			// cylinder sides + dome
			{
				d:
					'M8.1 5.4c0-1.35 1.75-2.45 3.9-2.45s3.9 1.1 3.9 2.45' +
					'v12.5c0 1.5-1.75 2.7-3.9 2.7s-3.9-1.2-3.9-2.7V5.4z',
				strokeWidth: STROKE,
			},
			// horizontal bands
			{ d: 'M8.1 8.2h7.8', strokeWidth: STROKE },
			{ d: 'M8.1 11.1h7.8', strokeWidth: STROKE },
			{ d: 'M8.1 14h7.8', strokeWidth: STROKE },
			{ d: 'M8.1 16.9h7.8', strokeWidth: STROKE },
			// feet
			{ d: 'M9.2 20.6v1.3M14.8 20.6v1.3', strokeWidth: STROKE },
		],
	},
};

/** First-path d only (compat). */
export const loadSplitSvgPaths: Record<LoadSplitSvgKind, string> = {
	car: loadSplitIcons.car.paths[0].d,
	tesla: loadSplitIcons.tesla.paths[0].d,
	puma: loadSplitIcons.puma.paths[0].d,
	house: loadSplitIcons.house.paths[0].d,
	heat_pump: loadSplitIcons.heat_pump.paths[0].d,
	tank: loadSplitIcons.tank.paths[0].d,
};

export const loadSplitMdiIcons: Record<LoadSplitSvgKind, string> = {
	car: loadSplitIcons.car.mdiFallback,
	tesla: loadSplitIcons.tesla.mdiFallback,
	puma: loadSplitIcons.puma.mdiFallback,
	house: loadSplitIcons.house.mdiFallback,
	heat_pump: loadSplitIcons.heat_pump.mdiFallback,
	tank: loadSplitIcons.tank.mdiFallback,
};

const ID_TO_KIND: Record<string, LoadSplitSvgKind> = {
	house: 'house',
	car: 'car',
	cars: 'car',
	tesla: 'tesla',
	puma: 'puma',
	heat_pump: 'heat_pump',
	heatpump: 'heat_pump',
	sunamp: 'tank',
	water_heater: 'tank',
	tank: 'tank',
};

const MDI_TO_KIND: Record<string, LoadSplitSvgKind> = {
	'mdi:car': 'car',
	'mdi:car-side': 'car',
	'mdi:car-electric': 'car',
	'mdi:car-estate': 'car',
	'mdi:ev-station': 'car',
	'mdi:ev-plug-type2': 'car',
	'mdi:home': 'house',
	'mdi:home-outline': 'house',
	'mdi:home-variant': 'house',
	'mdi:heat-pump': 'heat_pump',
	'mdi:heat-pump-outline': 'heat_pump',
	'mdi:air-conditioner': 'heat_pump',
	'mdi:hvac': 'heat_pump',
	'mdi:snowflake': 'heat_pump',
	'mdi:propane-tank': 'tank',
	'mdi:water-boiler': 'tank',
	'mdi:barrel': 'tank',
	'mdi:cup': 'tank',
	'mdi:storage-tank': 'tank',
	'mdi:gas-cylinder': 'tank',
};

export function resolveLoadSplitSvgKind(
	nodeId: string,
	icon?: string,
): LoadSplitSvgKind | null {
	const idKey = nodeId?.toLowerCase?.() || '';
	if (ID_TO_KIND[idKey]) {
		return ID_TO_KIND[idKey];
	}
	const iconKey = (icon || '').trim().toLowerCase();
	if (iconKey && MDI_TO_KIND[iconKey]) {
		return MDI_TO_KIND[iconKey];
	}
	return null;
}

export function resolveModernSplitMdi(
	nodeId: string,
	icon?: string,
): string | null {
	const kind = resolveLoadSplitSvgKind(nodeId, icon);
	return kind ? loadSplitMdiIcons[kind] : null;
}

export function isImageIcon(icon?: string): boolean {
	if (!icon) return false;
	const v = icon.trim().toLowerCase();
	return (
		v.startsWith('http://') ||
		v.startsWith('https://') ||
		v.startsWith('/') ||
		v.startsWith('data:')
	);
}
