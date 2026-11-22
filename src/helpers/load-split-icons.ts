/**
 * Modern Material Design Icons for house/cars load split.
 *
 * Uses official @mdi/svg path data (not hand-drawn shapes) so icons match
 * Home Assistant density. Known node ids and legacy bad YAML keys
 * (mdi:ev-station, mdi:snowflake, mdi:water-boiler as heat-pump stand-in, etc.)
 * remap to these modern icons. Image URLs still override.
 */

export type LoadSplitSvgKind = 'car' | 'house' | 'heat_pump' | 'tank';

/** Canonical modern MDI keys for split nodes. */
export const loadSplitMdiIcons: Record<LoadSplitSvgKind, string> = {
	car: 'mdi:car-side',
	house: 'mdi:home-outline',
	heat_pump: 'mdi:heat-pump',
	tank: 'mdi:propane-tank',
};

/**
 * Official Material Design Icons path data (viewBox 0 0 24 24).
 * Source: @mdi/svg 7.4.47 — same glyphs HA ships via mdi:*.
 */
const MDI_CAR_SIDE =
	'M16,6L19,10H21C22.11,10 23,10.89 23,12V15H21A3,3 0 0,1 18,18A3,3 0 0,1 15,15H9A3,3 0 0,1 6,18A3,3 0 0,1 3,15H1V12C1,10.89 1.89,10 3,10L6,6H16M10.5,7.5H6.75L4.86,10H10.5V7.5M12,7.5V10H17.14L15.25,7.5H12M6,13.5A1.5,1.5 0 0,0 4.5,15A1.5,1.5 0 0,0 6,16.5A1.5,1.5 0 0,0 7.5,15A1.5,1.5 0 0,0 6,13.5M18,13.5A1.5,1.5 0 0,0 16.5,15A1.5,1.5 0 0,0 18,16.5A1.5,1.5 0 0,0 19.5,15A1.5,1.5 0 0,0 18,13.5Z';

const MDI_HOME_OUTLINE =
	'M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22';

const MDI_HEAT_PUMP =
	'M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M12.75 7.08C13.57 7.2 14.32 7.5 14.95 8L12.75 10.19V7.08M11.25 7.08V10.19L9.05 8C9.68 7.5 10.43 7.2 11.25 7.08M8 9.05L10.19 11.25H7.08C7.2 10.43 7.5 9.68 8 9.05M7.08 12.75H10.19L8 14.95C7.5 14.32 7.2 13.57 7.08 12.75M11.25 16.92C10.43 16.8 9.68 16.5 9.05 16L11.25 13.81V16.92M12 13C11.45 13 11 12.55 11 12S11.45 11 12 11 13 11.45 13 12 12.55 13 12 13M12.75 16.92V13.81L14.95 16C14.32 16.5 13.57 16.8 12.75 16.92M16 14.95L13.81 12.75H16.92C16.8 13.57 16.5 14.32 16 14.95M13.81 11.25L16 9.05C16.5 9.69 16.8 10.44 16.92 11.25H13.81Z';

const MDI_PROPANE_TANK =
	'M4 15V18C4 20.21 5.79 22 8 22H16C18.21 22 20 20.21 20 18V15H4M20 13V10C20 8.14 18.72 6.59 17 6.14V4C17 2.9 16.1 2 15 2H9C7.9 2 7 2.9 7 4V6.14C5.28 6.59 4 8.14 4 10V13H20M9 4H15V6H13C13 5.45 12.55 5 12 5S11 5.45 11 6H9V4Z';

export const loadSplitSvgPaths: Record<LoadSplitSvgKind, string> = {
	car: MDI_CAR_SIDE,
	house: MDI_HOME_OUTLINE,
	heat_pump: MDI_HEAT_PUMP,
	tank: MDI_PROPANE_TANK,
};

const ID_TO_KIND: Record<string, LoadSplitSvgKind> = {
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

/**
 * Legacy / generic MDI keys → modern split kind.
 * Remaps EV-charger / snowflake / boiler stand-ins to the polished icons.
 */
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
 * Resolve modern split icon kind for a node.
 * Prefer node id; remap legacy MDI so old YAML still gets polished art.
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

/** Resolve the modern mdi:* string for a split node (for docs / ha-icon fallback). */
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
