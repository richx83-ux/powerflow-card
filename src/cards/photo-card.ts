import { html, TemplateResult, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';
import { DataDto, detailedPowerFlowCardConfig, NamedLoadItem } from '../types';
import { UnitOfPower } from '../const';
import { Utils } from '../helpers/utils';
import {
	resolveLoadSplitSvgKind,
	isImageIcon,
	type LoadSplitSvgKind,
} from '../helpers/load-split-icons';
import {
	renderPhotoTileIcon,
	type PhotoTileIconKind,
} from '../helpers/photo-icons';

/** Logical canvas for % placement + SVG flow overlay (16:9). */
const CANVAS_W = 1000;
const CANVAS_H = 562;

type Pt = { x: number; y: number };

type TileDef = {
	id: string;
	label: string;
	powerLabel: string;
	subLabel?: string;
	colour: string;
	entity?: string;
	iconKind?: PhotoTileIconKind | null;
	iconUrl?: string;
	x: number; // centre % of canvas width (0–100)
	y: number; // centre % of canvas height (0–100)
	active: boolean;
	size?: 'lg' | 'md' | 'sm';
};

type FlowDef = {
	id: string;
	from: Pt;
	to: Pt;
	colour: string;
	power: number;
	/** true = animate from → to; false = reverse */
	forward: boolean;
};

function formatPower(
	power: number,
	autoScale: boolean,
	decimalPlaces: number,
): string {
	const abs = Math.abs(power);
	return autoScale
		? `${Utils.convertValue(abs, decimalPlaces) || 0}`
		: `${Math.round(abs) || 0} ${UnitOfPower.WATT}`;
}

function manhattanPath(a: Pt, b: Pt, style: 'manhattan' | 'curved'): string {
	if (style === 'curved') {
		const dx = Math.abs(b.x - a.x);
		const c1x = a.x + dx * 0.35;
		const c2x = b.x - dx * 0.35;
		return `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`;
	}
	// Prefer horizontal then vertical when mostly side-by-side
	const midX = (a.x + b.x) / 2;
	return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
}

function pctToCanvas(xPct: number, yPct: number): Pt {
	return {
		x: (xPct / 100) * CANVAS_W,
		y: (yPct / 100) * CANVAS_H,
	};
}

function resolveIconKind(id: string, icon?: string): PhotoTileIconKind | null {
	const split = resolveLoadSplitSvgKind(id, icon);
	if (split) return split;
	const key = id.toLowerCase();
	if (key === 'solar' || key === 'pv') return 'solar';
	if (key === 'grid') return 'grid';
	if (key === 'battery' || key === 'bat') return 'battery';
	if (key === 'load' || key === 'essential') return 'load';
	return null;
}

function tileClick(e: Event, entity?: string) {
	if (!entity) return;
	Utils.handlePopup(e, entity);
}

function renderTile(tile: TileDef): TemplateResult {
	const left = `${tile.x}%`;
	const top = `${tile.y}%`;
	const size = tile.size || 'md';
	const icon =
		tile.iconUrl && isImageIcon(tile.iconUrl)
			? html`<img class="pf-photo-icon-img" src="${tile.iconUrl}" alt="" />`
			: renderPhotoTileIcon(
					tile.iconKind,
					tile.colour,
					size === 'lg' ? 32 : 26,
				);

	return html`
		<button
			type="button"
			class=${classMap({
				'pf-glass-tile': true,
				'pf-glass-tile--lg': size === 'lg',
				'pf-glass-tile--sm': size === 'sm',
				'pf-glass-tile--idle': !tile.active,
			})}
			style=${styleMap({
				left,
				top,
				'--pf-tile-accent': tile.colour,
			})}
			@click=${(e: Event) => tileClick(e, tile.entity)}
			title="${tile.label}"
		>
			<div class="pf-glass-tile__icon">${icon}</div>
			<div class="pf-glass-tile__power">${tile.powerLabel}</div>
			<div class="pf-glass-tile__label">${tile.label}</div>
			${
				tile.subLabel
					? html`<div class="pf-glass-tile__sub">${tile.subLabel}</div>`
					: nothing
			}
		</button>
	`;
}

function flowDuration(power: number, maxPower: number, base: number): number {
	const ratio = Math.min(1, Math.abs(power) / Math.max(1, maxPower));
	return Math.max(1.2, base * (1.15 - ratio * 0.75));
}

function renderFlows(
	flows: FlowDef[],
	style: 'manhattan' | 'curved',
	disableAnim: boolean,
	threshold: number,
	maxPower: number,
): TemplateResult {
	return html`
		<svg
			class="pf-photo-flows"
			viewBox="0 0 ${CANVAS_W} ${CANVAS_H}"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			${flows.map((f) => {
				if (Math.abs(f.power) < threshold) {
					return html`
						<path
							class="pf-flow-idle"
							d="${manhattanPath(f.from, f.to, style)}"
							stroke="${f.colour}"
						/>
					`;
				}
				const d = manhattanPath(
					f.forward ? f.from : f.to,
					f.forward ? f.to : f.from,
					style,
				);
				const dur = flowDuration(f.power, maxPower, 4);
				return html`
					<path class="pf-flow-base" d="${d}" stroke="${f.colour}" />
					<path
						class=${classMap({
							'pf-flow-dash': true,
							'pf-flow-dash--static': disableAnim,
						})}
						d="${d}"
						stroke="${f.colour}"
						style=${styleMap({
							animationDuration: `${dur}s`,
						})}
					/>
				`;
			})}
		</svg>
	`;
}

function layoutNamedLoads(
	items: NamedLoadItem[],
	startX: number,
	startY: number,
	pitchY: number,
	autoScale: boolean,
	decimals: number,
): TileDef[] {
	return items.map((item, i) => {
		const kind = (item.svgKind ||
			resolveLoadSplitSvgKind(item.id, item.icon)) as LoadSplitSvgKind | null;
		return {
			id: item.id,
			label: item.name,
			powerLabel: formatPower(item.power, autoScale, decimals),
			colour: item.colour,
			entity: item.entity,
			iconKind: kind,
			iconUrl: isImageIcon(item.icon) ? item.icon : undefined,
			x: startX,
			y: startY + i * pitchY,
			active: Math.abs(item.power) > 0,
			size: 'sm' as const,
		};
	});
}

/**
 * Photo-background glass-tile power flow (cardstyle: photo).
 * Reuses entities + load_groups / large_loads / car_loads from DataDto.
 */
export const photoCard = (
	config: detailedPowerFlowCardConfig,
	_inverterImg: string,
	data: DataDto,
): TemplateResult => {
	const photo = config.photo || {};
	const bg = (config.background_image || photo.background_image || '').trim();
	const fit = config.background_fit || photo.background_fit || 'cover';
	const opacity =
		typeof photo.tile_opacity === 'number'
			? Math.min(1.2, Math.max(0.15, photo.tile_opacity))
			: 0.55;
	const blur =
		typeof photo.tile_blur === 'number'
			? Math.min(24, Math.max(0, photo.tile_blur))
			: 12;
	const flowStyle = photo.flow_style === 'curved' ? 'curved' : 'manhattan';
	const threshold =
		typeof photo.flow_threshold === 'number' ? photo.flow_threshold : 1;
	const accent = photo.accent || data.loadColour || '#5fb6ad';
	const autoScale = config.load?.auto_scale !== false;
	const decimals = data.decimalPlaces ?? 2;
	const showDaily = config.load?.show_daily !== false;

	const solarPower = data.totalPV || 0;
	const gridPower = data.totalGridPower || 0;
	const batPower = data.batteryPowerTotal ?? data.batteryPower ?? 0;
	const housePower = data.showLoadSplit
		? data.housePower
		: data.essentialPower || 0;
	const carPower = data.showLoadSplit ? data.carPower : 0;
	const essential = data.essentialPower || housePower + carPower;

	const solarColour = data.solarColour || '#ffa500';
	const gridColour = data.gridColour || '#5490c2';
	const batColour = data.batteryColour || '#ffc0cb';
	const loadColour = data.loadColour || accent;
	const houseColour = data.houseColour || loadColour;
	const carColour = data.carColour || loadColour;

	const dailyLoad =
		showDaily && data.stateDayLoadEnergy?.isValid?.()
			? data.stateDayLoadEnergy.toPowerString?.(
					false,
					data.decimalPlacesEnergy,
				) ||
				`${Utils.toNum(data.stateDayLoadEnergy.state, data.decimalPlacesEnergy)} kWh`
			: undefined;

	// Layout centres (%). Left column sources → centre sinks → right children.
	const solarPos = { x: 18, y: 14 };
	const gridPos = { x: 18, y: 42 };
	const batPos = { x: 18, y: 72 };
	const housePos = { x: 48, y: 36 };
	const carsPos = { x: 48, y: 72 };
	const childX = 78;
	const largeStartY =
		data.largeLoads.length <= 1 ? 28 : data.largeLoads.length === 2 ? 22 : 16;
	const carStartY =
		data.carLoads.length <= 1 ? 68 : data.carLoads.length === 2 ? 62 : 56;
	const childPitch =
		data.largeLoads.length > 2 || data.carLoads.length > 2 ? 14 : 16;

	const tiles: TileDef[] = [];

	if (config.show_solar !== false) {
		tiles.push({
			id: 'solar',
			label: config.solar?.custom_label || 'Solar',
			powerLabel: formatPower(solarPower, autoScale, decimals),
			colour: solarColour,
			entity: config.entities?.pv_total || config.entities?.pv1_power_186,
			iconKind: 'solar',
			x: solarPos.x,
			y: solarPos.y,
			active: solarPower > threshold,
			size: 'md',
		});
	}

	if (config.show_grid !== false) {
		const importing = gridPower < 0;
		tiles.push({
			id: 'grid',
			label: config.grid?.grid_name || 'Grid',
			powerLabel: formatPower(gridPower, autoScale, decimals),
			subLabel:
				Math.abs(gridPower) > threshold
					? importing
						? 'Import'
						: 'Export'
					: undefined,
			colour: gridColour,
			entity:
				config.entities?.grid_ct_power_172 || config.entities?.grid_power_169,
			iconKind: 'grid',
			x: gridPos.x,
			y: gridPos.y,
			active: Math.abs(gridPower) > threshold,
			size: 'md',
		});
	}

	if (config.show_battery !== false) {
		const charging = batPower < 0;
		const soc = data.stateBatterySoc?.isValid?.()
			? `${Utils.toNum(data.stateBatterySoc.state, 0)}%`
			: undefined;
		tiles.push({
			id: 'battery',
			label: 'Battery',
			powerLabel: formatPower(batPower, autoScale, decimals),
			subLabel:
				[
					soc,
					Math.abs(batPower) > threshold
						? charging
							? 'Charging'
							: 'Discharging'
						: undefined,
				]
					.filter(Boolean)
					.join(' · ') || undefined,
			colour: batColour,
			entity: config.entities?.battery_power_190,
			iconKind: 'battery',
			x: batPos.x,
			y: batPos.y,
			active: Math.abs(batPower) > threshold,
			size: 'md',
		});
	}

	tiles.push({
		id: 'house',
		label: data.houseName || config.load?.essential_name || 'House',
		powerLabel: formatPower(
			data.showLoadSplit ? housePower : essential,
			autoScale,
			decimals,
		),
		subLabel: dailyLoad ? `Daily ${dailyLoad}` : undefined,
		colour: houseColour,
		entity:
			config.load_groups?.house_entity || config.entities?.essential_power,
		iconKind: resolveIconKind('house', data.houseIcon) || 'house',
		iconUrl: isImageIcon(data.houseIcon) ? data.houseIcon : undefined,
		x: housePos.x,
		y: housePos.y,
		active: Math.abs(data.showLoadSplit ? housePower : essential) > threshold,
		size: 'lg',
	});

	if (
		data.showLoadSplit ||
		(config.load_groups?.car_entity && config.load_groups.car_entity !== 'none')
	) {
		tiles.push({
			id: 'cars',
			label: data.carName || 'Cars',
			powerLabel: formatPower(carPower, autoScale, decimals),
			colour: carColour,
			entity: config.load_groups?.car_entity,
			iconKind: resolveIconKind('car', data.carIcon) || 'car',
			iconUrl: isImageIcon(data.carIcon) ? data.carIcon : undefined,
			x: carsPos.x,
			y: carsPos.y,
			active: Math.abs(carPower) > threshold,
			size: 'md',
		});
	}

	tiles.push(
		...layoutNamedLoads(
			data.largeLoads || [],
			childX,
			largeStartY,
			childPitch,
			autoScale,
			decimals,
		),
		...layoutNamedLoads(
			data.carLoads || [],
			childX,
			carStartY,
			childPitch,
			autoScale,
			decimals,
		),
	);

	const flows: FlowDef[] = [];
	const housePt = pctToCanvas(housePos.x, housePos.y);
	const carsPt = pctToCanvas(carsPos.x, carsPos.y);

	if (config.show_solar !== false && solarPower > threshold) {
		flows.push({
			id: 'solar-house',
			from: pctToCanvas(solarPos.x, solarPos.y),
			to: housePt,
			colour: solarColour,
			power: solarPower,
			forward: true,
		});
	}

	if (config.show_grid !== false && Math.abs(gridPower) > threshold) {
		const gridPt = pctToCanvas(gridPos.x, gridPos.y);
		const importing = gridPower < 0;
		flows.push({
			id: 'grid-house',
			from: importing ? gridPt : housePt,
			to: importing ? housePt : gridPt,
			colour: gridColour,
			power: gridPower,
			forward: true,
		});
	}

	if (config.show_battery !== false && Math.abs(batPower) > threshold) {
		const batPt = pctToCanvas(batPos.x, batPos.y);
		const charging = batPower < 0;
		flows.push({
			id: 'bat-house',
			from: charging ? housePt : batPt,
			to: charging ? batPt : housePt,
			colour: batColour,
			power: batPower,
			forward: true,
		});
	}

	if (tiles.some((t) => t.id === 'cars') && Math.abs(carPower) > threshold) {
		flows.push({
			id: 'house-cars',
			from: housePt,
			to: carsPt,
			colour: carColour,
			power: carPower,
			forward: true,
		});
	}

	(data.largeLoads || []).forEach((item, i) => {
		const y = largeStartY + i * childPitch;
		flows.push({
			id: `house-${item.id}`,
			from: housePt,
			to: pctToCanvas(childX, y),
			colour: item.colour || houseColour,
			power: item.power,
			forward: true,
		});
	});

	(data.carLoads || []).forEach((item, i) => {
		const y = carStartY + i * childPitch;
		flows.push({
			id: `cars-${item.id}`,
			from: carsPt,
			to: pctToCanvas(childX, y),
			colour: item.colour || carColour,
			power: item.power,
			forward: true,
		});
	});

	const maxFlowPower = Math.max(
		config.solar?.max_power || 8000,
		config.battery?.max_power || 4500,
		config.load?.max_power || 8000,
		config.grid?.max_power || 8000,
		1,
	);

	const title = config.title
		? html`
				<div
					class="pf-photo-title"
					style=${styleMap({
						color: config.title_colour || '#fff',
						fontSize: config.title_size || '22px',
					})}
				>
					${config.title}
				</div>
			`
		: nothing;

	const bgStyle = bg
		? {
				backgroundImage: `url(${bg})`,
				backgroundSize: fit,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}
		: {
				backgroundImage:
					'linear-gradient(160deg, #1a2332 0%, #2c3e50 40%, #4a3728 70%, #1b2838 100%)',
			};

	return html`
		<ha-card class="pf-photo-card">
			<div
				class="pf-photo-stage"
				style=${styleMap({
					...bgStyle,
					'--pf-tile-opacity': String(opacity),
					'--pf-tile-blur': `${blur}px`,
					'--pf-accent': accent,
					height: data.cardHeight || '100%',
					width: data.cardWidth || '100%',
				})}
			>
				<div class="pf-photo-scrim"></div>
				${title}
				${renderFlows(
					flows,
					flowStyle,
					config.disable_animations === true,
					threshold,
					maxFlowPower,
				)}
				<div class="pf-photo-tiles">${tiles.map((t) => renderTile(t))}</div>
			</div>
		</ha-card>
	`;
};
