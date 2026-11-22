/**
 * Built-in mockup SVG paths (viewBox 0 0 24 24) for house/cars load split.
 * Prefer these over ha-icon/MDI so HA matches the mockup even when YAML
 * still has old keys like mdi:ev-station / mdi:snowflake / mdi:water-boiler.
 */

export type LoadSplitSvgKind = 'car' | 'house' | 'heat_pump' | 'tank';

/** Side-view car silhouette (mockup style). */
const CAR_PATH =
	'M5 11h14l-1.2-3.5c-.3-.9-1.1-1.5-2-1.5H8.2c-.9 0-1.7.6-2 1.5L5 11zm-.5 1.5' +
	'c-.8 0-1.5.7-1.5 1.5v1c0 .3.2.5.5.5h1.1c.3 1.2 1.4 2 2.7 2s2.4-.8 2.7-2h5c.3 1.2' +
	' 1.4 2 2.7 2s2.4-.8 2.7-2H21c.3 0 .5-.2.5-.5v-1c0-.8-.7-1.5-1.5-1.5H4.5zM8.5 16.5' +
	'a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM8.5 7.5h7l.8 2.5H7.7l.8-2.5z';

/** Simple home silhouette. */
const HOUSE_PATH =
	'M12 3L3 10.5V21h6v-6h6v6h6V10.5L12 3zm0 2.4l6 4.7V19h-2v-6H8v6H6v-7.9l6-4.7z';

/** Outdoor heat-pump / condenser unit with fan grille. */
const HEAT_PUMP_PATH =
	'M3 5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2v9h16V7H4z' +
	'm8 1.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6zm0 1.5a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6z' +
	'M2 19h20v1.5H2V19z';

/** Cylindrical tank (Sunamp-style heat battery). */
const TANK_PATH =
	'M9 2h6c.6 0 1 .4 1 1v1h.5c1.9 0 3.5 1.6 3.5 3.5V19c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3' +
	'V7.5C4 5.6 5.6 4 7.5 4H8V3c0-.6.4-1 1-1zm1 2v1h4V4h-4zM7.5 6C6.7 6 6 6.7 6 7.5V19c0' +
	' .6.4 1 1 1h10c.6 0 1-.4 1-1V7.5c0-.8-.7-1.5-1.5-1.5h-9zM8 9h8v1.5H8V9zm0 3.5h8V14H8v-1.5z';

export const loadSplitSvgPaths: Record<LoadSplitSvgKind, string> = {
	car: CAR_PATH,
	house: HOUSE_PATH,
	heat_pump: HEAT_PUMP_PATH,
	tank: TANK_PATH,
};

const ID_TO_SVG: Record<string, LoadSplitSvgKind> = {
	house: 'house',
	car: 'car',
	cars: 'car',
	tesla: 'car',
	puma: 'car',
	heat_pump: 'heat_pump',
	heatpump: 'heat_pump',
	sunamp: 'tank',
	water_heater: 'tank',
	tank: 'tank',
};

/** Old / generic MDI keys → built-in mockup SVGs. */
const MDI_TO_SVG: Record<string, LoadSplitSvgKind> = {
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
 * Resolve built-in mockup SVG for a split node.
 * Prefer node id; remap legacy MDI strings so old YAML still gets mockup art.
 * Returns null only for unknown custom icons (e.g. image URL or novel mdi:).
 */
export function resolveLoadSplitSvgKind(
	nodeId: string,
	icon?: string,
): LoadSplitSvgKind | null {
	const idKey = nodeId?.toLowerCase?.() || '';
	if (ID_TO_SVG[idKey]) {
		return ID_TO_SVG[idKey];
	}
	const iconKey = (icon || '').trim().toLowerCase();
	if (iconKey && MDI_TO_SVG[iconKey]) {
		return MDI_TO_SVG[iconKey];
	}
	return null;
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
