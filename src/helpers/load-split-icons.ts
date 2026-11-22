/**
 * Original vector icons for house/cars load split.
 *
 * Distinct silhouettes wired by load id (tesla, puma, heat_pump, sunamp, …).
 * No brand logos/badges — vehicle *shape* only. Legacy MDI keys remap here;
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
	/** Default nonzero; use evenodd for cutouts (wheels, windows, grille). */
	fillRule?: 'evenodd' | 'nonzero';
};

export type LoadSplitIconDef = {
	paths: LoadSplitPath[];
	/** Optional ha-icon fallback if path render unavailable. */
	mdiFallback: string;
};

/**
 * Original filled silhouettes (viewBox 0 0 24 24), tuned for ~22–28px on dark HA.
 */
export const loadSplitIcons: Record<LoadSplitSvgKind, LoadSplitIconDef> = {
	/** Cars hub — modern EV hatch, generic (not Y / Puma). */
	car: {
		mdiFallback: 'mdi:car-side',
		paths: [
			{
				fillRule: 'evenodd',
				d:
					'M2.4 14.1h1.1l.4-2.1c.25-1.25 1.05-2.15 2.25-2.55L9.2 8.4' +
					'c1.05-.4 2.2-.55 3.35-.4l3.3.5c1.15.2 2.05.85 2.55 1.85l1.15 2.35h1.35' +
					'c.55 0 1 .4 1.05.95l.15 1.35c.05.45-.3.85-.75.85h-.85c-.15 1.35-1.3 2.4-2.7 2.4' +
					's-2.55-1.05-2.7-2.4H9.9c-.15 1.35-1.3 2.4-2.7 2.4S4.65 18.4 4.5 17.05H3.2' +
					'c-.5 0-.9-.4-.9-.9v-.95c0-.55.45-1 1-1.1z' +
					'M6.75 15.35a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7zm9.3 0a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7z' +
					'M9.05 9.55l2.55-.75c.7-.2 1.4-.2 2.05 0l2.2.55c.35.1.5.5.35.8l-.7 1.45' +
					'c-.1.2-.3.35-.55.35H9.95c-.35 0-.6-.35-.5-.7l.6-1.7z',
			},
		],
	},

	/** Tesla Model Y — low sleek crossover, continuous fastback slope. */
	tesla: {
		mdiFallback: 'mdi:car-side',
		paths: [
			{
				fillRule: 'evenodd',
				d:
					'M1.8 14.35h1.05l.35-1.85C3.45 10.9 4.4 9.85 5.85 9.35L8.9 8.2' +
					'c1.35-.5 2.85-.6 4.25-.25l2.9.75c1.2.3 2.1 1.05 2.55 2.15l.85 2.05h1.4' +
					'c.5 0 .9.4.95.9l.2 1.45c.05.4-.25.75-.65.75h-.7c-.1 1.4-1.25 2.5-2.7 2.5' +
					's-2.6-1.1-2.7-2.5H9.55c-.1 1.4-1.25 2.5-2.7 2.5s-2.6-1.1-2.7-2.5H2.55' +
					'c-.45 0-.8-.35-.85-.8v-1.05c0-.5.4-.9.9-.95h.2z' +
					'M6.85 15.55a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zm9.5 0a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z' +
					'M8.6 9.35l3.1-.85c.85-.25 1.75-.2 2.55.15l2.05.85c.3.12.42.48.28.76l-.85 1.65' +
					'c-.1.2-.3.32-.52.32H9.35c-.4 0-.68-.4-.55-.78l.8-2.1z',
			},
		],
	},

	/** Ford Puma — taller compact crossover, more upright arched rear. */
	puma: {
		mdiFallback: 'mdi:car-side',
		paths: [
			{
				fillRule: 'evenodd',
				d:
					'M2.1 14.2h1.15l.3-1.55c.3-1.45 1.25-2.35 2.65-2.7L8.5 9.15' +
					'c.7-.2 1.45-.25 2.2-.1l1.5.35 1.85.15c.95.1 1.7.55 2.2 1.25l.55.8 1.35.15' +
					'c.85.1 1.5.8 1.5 1.65v.85h.55c.5 0 .9.4.9.9v.85c0 .5-.4.9-.9.9h-.55' +
					'c-.15 1.3-1.25 2.3-2.6 2.3s-2.45-1-2.6-2.3H9.35c-.15 1.3-1.25 2.3-2.6 2.3' +
					's-2.45-1-2.6-2.3H2.85c-.5 0-.9-.4-.9-.9v-.95c0-.5.4-.9.9-.95h.25z' +
					'M6.75 15.45a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7zm9.1 0a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7z' +
					'M8.35 9.95l2.4-.55c.55-.12 1.15-.1 1.7.1l1.35.5c.55.2.95.55 1.15 1.05l.35.85' +
					'c.08.2-.05.42-.25.48l-1.55.4c-.15.04-.3-.05-.35-.2l-.25-.7c-.1-.3-.4-.5-.7-.5H9.1' +
					'c-.4 0-.7-.35-.6-.72l.85-1.71z',
			},
		],
	},

	/** House hub — modern filled home with door cutout. */
	house: {
		mdiFallback: 'mdi:home',
		paths: [
			{
				fillRule: 'evenodd',
				d:
					'M12 2.6L2.4 11.2c-.35.3-.15.9.3.9H5.2v8.1c0 .55.45 1 1 1h11.6c.55 0 1-.45 1-1' +
					'v-8.1h2.5c.45 0 .65-.6.3-.9L12 2.6zM10.4 15.6h3.2v5.6h-3.2z',
			},
		],
	},

	/**
	 * Outdoor heat-pump / condenser unit: cabinet, feet, circular fan grille.
	 */
	heat_pump: {
		mdiFallback: 'mdi:heat-pump',
		paths: [
			{
				fillRule: 'evenodd',
				d:
					// outer cabinet
					'M3.6 4h16.8c.77 0 1.4.63 1.4 1.4v12.3c0 .77-.63 1.4-1.4 1.4H17.8v1.5h-1.7v-1.5H7.9v1.5H6.2v-1.5H3.6' +
					'c-.77 0-1.4-.63-1.4-1.4V5.4c0-.77.63-1.4 1.4-1.4z' +
					// fan outer disc hole (recess)
					'M12 7.35a4.15 4.15 0 1 0 0 8.3 4.15 4.15 0 0 0 0-8.3zm0 1.35a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z',
			},
			// hub + four blades (solid on top of grille)
			{
				d:
					'M12 10.55a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z' +
					'M11.55 8.2h.9v2.05h-.9zm0 5.55h.9V15.8h-.9z' +
					'M8.2 11.55h2.05v.9H8.2zm5.55 0H15.8v.9h-2.05z',
			},
		],
	},

	/** Cylindrical thermal store (Sunamp-style heat battery). */
	tank: {
		mdiFallback: 'mdi:propane-tank',
		paths: [
			{
				fillRule: 'evenodd',
				d:
					// stem + dome + cylinder + base
					'M11.25 1.2h1.5v1.7h-1.5z' +
					'M8 5.1c0-1.6 1.8-2.9 4-2.9s4 1.3 4 2.9v12.6c0 1.75-1.8 3.15-4 3.15s-4-1.4-4-3.15V5.1z' +
					// insulation bands (cut)
					'M8.85 9.1h6.3v1.2H8.85zm0 3.4h6.3v1.2H8.85z' +
					// dome highlight
					'M9.5 4.85c0-.7 1.1-1.25 2.5-1.25s2.5.55 2.5 1.25c0 .18-.14.32-.32.32H9.82c-.18 0-.32-.14-.32-.32z',
			},
		],
	},
};

/** Flat path map for simple single-path consumers (first path only). */
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

/** Legacy / generic MDI → custom kind (id still wins when present). */
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

/**
 * Resolve custom icon kind for a split node.
 * Prefer node id (tesla/puma/heat_pump/sunamp); remap legacy MDI otherwise.
 */
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
