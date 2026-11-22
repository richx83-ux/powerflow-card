import { convertToCustomEntity } from '../inverters/dto/custom-entity';
import type { CustomEntity } from '../inverters/dto/custom-entity';
import type { NamedLoadItem, detailedPowerFlowCardConfig } from '../types';
import { isImageIcon, resolveLoadSplitSvgKind } from './load-split-icons';

/** Modern MDI defaults (same glyphs as built-in split SVG paths). */
const DEFAULT_HOUSE_ICON = 'mdi:home-outline';
const DEFAULT_CAR_ICON = 'mdi:car-side';
const DEFAULT_HEAT_PUMP_ICON = 'mdi:heat-pump';
const DEFAULT_TANK_ICON = 'mdi:propane-tank';
const DEFAULT_LARGE_LOAD_ICON = 'mdi:lightning-bolt';
const MAX_VISIBLE_LOADS = 4;

/** Sensible icons for common large_loads / car_loads ids when icon omitted. */
const ID_ICON_DEFAULTS: Record<string, string> = {
	house: DEFAULT_HOUSE_ICON,
	car: DEFAULT_CAR_ICON,
	cars: DEFAULT_CAR_ICON,
	heat_pump: DEFAULT_HEAT_PUMP_ICON,
	heatpump: DEFAULT_HEAT_PUMP_ICON,
	sunamp: DEFAULT_TANK_ICON,
	water_heater: DEFAULT_TANK_ICON,
	tesla: DEFAULT_CAR_ICON,
	puma: DEFAULT_CAR_ICON,
};

export type HassStates = Record<string, unknown>;

export function resolveNodeIcon(
	config: detailedPowerFlowCardConfig,
	nodeId: string,
	fallback?: string,
): string {
	const fromMap = config.icons?.[nodeId];
	if (fromMap && fromMap !== 'default') {
		return fromMap;
	}
	const fromId = ID_ICON_DEFAULTS[nodeId];
	if (fromId) {
		return fromId;
	}
	return fallback || DEFAULT_LARGE_LOAD_ICON;
}

export function shouldShowLoadSplit(
	config: detailedPowerFlowCardConfig,
): boolean {
	const groups = config.load_groups;
	if (!groups?.show_split) {
		return false;
	}
	const house = groups.house_entity?.trim();
	const car = groups.car_entity?.trim();
	// Both buckets required for the visual split (matches config-sketch).
	return Boolean(house && car && house !== 'none' && car !== 'none');
}

function entityFromStates(
	hassStates: HassStates | undefined,
	entityId: string | undefined,
	track: (id: string) => void,
): CustomEntity {
	const id = entityId?.trim();
	if (id && id !== 'none') {
		track(id);
	}
	const haState = id && id !== 'none' ? hassStates?.[id] : undefined;
	return convertToCustomEntity(
		haState !== undefined
			? haState
			: { state: undefined, attributes: { unit_of_measurement: '' } },
	);
}

export function buildNamedLoads(
	config: detailedPowerFlowCardConfig,
	list: detailedPowerFlowCardConfig['large_loads'],
	hassStates: HassStates | undefined,
	track: (id: string) => void,
	colourFor: (power: number, maxThreshold?: number) => string,
	defaultIcon: string,
): NamedLoadItem[] {
	if (!list?.length) {
		return [];
	}
	return list.slice(0, MAX_VISIBLE_LOADS).map((item) => {
		const state = entityFromStates(hassStates, item.entity, track);
		const power = state.isValid() ? state.toPower(false) : 0;
		const fromMap = config.icons?.[item.id];
		const icon =
			item.icon && item.icon !== 'default'
				? item.icon
				: fromMap && fromMap !== 'default'
					? fromMap
					: resolveNodeIcon(config, item.id, defaultIcon);
		// Built-in mockup SVG wins for known ids / remapped legacy MDI,
		// unless the user supplied an image URL.
		const svgKind = isImageIcon(icon)
			? undefined
			: (resolveLoadSplitSvgKind(item.id, icon) ?? undefined);
		return {
			id: item.id,
			name: item.name,
			entity: item.entity,
			icon,
			svgKind,
			power,
			colour: colourFor(power, item.max_threshold),
			state,
		};
	});
}

export function buildLoadGroupSnapshot(
	config: detailedPowerFlowCardConfig,
	hassStates: HassStates | undefined,
	track: (id: string) => void,
	colourFor: (power: number, maxThreshold?: number) => string,
	invertLoad: boolean,
): {
	showLoadSplit: boolean;
	housePower: number;
	carPower: number;
	houseColour: string;
	carColour: string;
	houseIcon: string;
	carIcon: string;
	houseName: string;
	carName: string;
	largeLoads: NamedLoadItem[];
	carLoads: NamedLoadItem[];
} {
	const showLoadSplit = shouldShowLoadSplit(config);
	const houseState = entityFromStates(
		hassStates,
		config.load_groups?.house_entity,
		track,
	);
	const carState = entityFromStates(
		hassStates,
		config.load_groups?.car_entity,
		track,
	);
	const housePower = houseState.isValid() ? houseState.toPower(invertLoad) : 0;
	const carPower = carState.isValid() ? carState.toPower(invertLoad) : 0;

	return {
		showLoadSplit,
		housePower,
		carPower,
		houseColour: colourFor(housePower),
		carColour: colourFor(carPower),
		houseIcon: resolveNodeIcon(config, 'house', DEFAULT_HOUSE_ICON),
		carIcon: resolveNodeIcon(config, 'car', DEFAULT_CAR_ICON),
		houseName: config.load_groups?.house_name || 'House',
		carName: config.load_groups?.car_name || 'Cars',
		// Always resolve named loads when configured (photo glass tiles + classic split).
		largeLoads: buildNamedLoads(
			config,
			config.large_loads,
			hassStates,
			track,
			colourFor,
			DEFAULT_LARGE_LOAD_ICON,
		),
		carLoads: buildNamedLoads(
			config,
			config.car_loads,
			hassStates,
			track,
			colourFor,
			DEFAULT_CAR_ICON,
		),
	};
}

export {
	MAX_VISIBLE_LOADS,
	DEFAULT_HOUSE_ICON,
	DEFAULT_CAR_ICON,
	DEFAULT_HEAT_PUMP_ICON,
	DEFAULT_TANK_ICON,
};
