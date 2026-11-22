import { html, svg } from 'lit';
import { Utils } from '../../../helpers/utils';
import { renderPath } from '../../../helpers/render-path';
import { renderCircle } from '../../../helpers/render-circle';
import { createTextWithPopup, renderText } from '../../../helpers/text-utils';
import { localize } from '../../../localize/localize';
import { UnitOfPower } from '../../../const';
import type {
	DataDto,
	NamedLoadItem,
	detailedPowerFlowCardConfig,
} from '../../../types';

type LayoutMode = 'full' | 'compact';

/** Child chip geometry — icon above, power in rect, name below (no overlap). */
const CHIP_W = 64;
const CHIP_H = 22;
/** Vertical pitch between stacked children. */
const CHILD_PITCH = 68;
/** Horizontal gap from parent hub left to child left (nest under / to the right). */
const CHILD_INSET_X = 86;

function formatPower(
	power: number,
	autoScale: boolean,
	decimalPlaces: number,
): string {
	return autoScale
		? `${Utils.convertValue(power, decimalPlaces) || 0}`
		: `${power || 0} ${UnitOfPower.WATT}`;
}

const HUB_BOX_W = 70;
const HUB_ICON_SIZE = 28;

/** Top-left X so a square icon FO is centred over a hub power box. */
function hubIconX(boxX: number, iconSize: number = HUB_ICON_SIZE): number {
	const foW = iconSize + 4;
	return boxX + (HUB_BOX_W - foW) / 2;
}

function renderColouredIcon(
	entity: string | undefined,
	icon: string | undefined,
	colour: string,
	x: number,
	y: number,
	size: number = 20,
) {
	if (!icon) {
		return svg``;
	}
	const foW = size + 4;
	const fo = svg`
		<foreignObject x="${x}" y="${y}" width="${foW}" height="${foW}" display="inline">
			<div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; justify-content: center; width: ${foW}px; height: ${foW}px;">
				<ha-icon icon="${icon}" style="color: ${colour}; --mdc-icon-size: ${size}px;"></ha-icon>
			</div>
		</foreignObject>
	`;
	if (entity) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity)}>${fo}</a>
		`;
	}
	return fo;
}

function renderChildChip(
	item: NamedLoadItem,
	x: number,
	y: number,
	autoScale: boolean,
	decimalPlaces: number,
) {
	const cx = x + CHIP_W / 2;
	return svg`
		<g id="named-load-${item.id}" class="load-group-child">
			${renderColouredIcon(item.entity, item.icon, item.colour, cx - 12, y - 22, 20)}
			<rect
				x="${x}"
				y="${y}"
				width="${CHIP_W}"
				height="${CHIP_H}"
				rx="4.5"
				ry="4.5"
				fill="none"
				stroke="${item.colour}"
				pointer-events="all"
			/>
			${createTextWithPopup(
				`named-load-${item.id}-power`,
				cx,
				y + 15,
				item.state.isValid(),
				'st3 st8',
				item.colour,
				item.state.toPowerString(autoScale, decimalPlaces),
				(e) => Utils.handlePopup(e, item.entity),
			)}
			${renderText(
				`named-load-${item.id}-name`,
				cx,
				y + CHIP_H + 11,
				true,
				'st3 st8',
				item.colour,
				item.name,
			)}
		</g>
	`;
}

function renderChildStem(
	id: string,
	parentRightX: number,
	parentMidY: number,
	childX: number,
	childMidY: number,
	colour: string,
) {
	const joinX = parentRightX + Math.max(10, (childX - parentRightX) / 2);
	const d = `M ${parentRightX} ${parentMidY} L ${joinX} ${parentMidY} L ${joinX} ${childMidY} L ${childX} ${childMidY}`;
	return renderPath(id, d, true, colour, 1);
}

/** First child Y so the stack is vertically centred on the parent hub. */
function firstChildYForStack(parentMidY: number, count: number): number {
	if (count <= 0) {
		return parentMidY - CHIP_H / 2;
	}
	const stackSpan = (count - 1) * CHILD_PITCH;
	return parentMidY - stackSpan / 2 - CHIP_H / 2;
}

function renderNestedChildren(
	items: NamedLoadItem[],
	parentBoxX: number,
	parentBoxY: number,
	parentBoxH: number,
	colour: string,
	autoScale: boolean,
	decimalPlaces: number,
	idPrefix: string,
) {
	if (!items.length) {
		return [];
	}
	const parentRightX = parentBoxX + 70;
	const parentMidY = parentBoxY + parentBoxH / 2;
	const childX = parentBoxX + CHILD_INSET_X;
	const firstY = firstChildYForStack(parentMidY, items.length);

	return items.map((item, index) => {
		const y = firstY + index * CHILD_PITCH;
		const childMidY = y + CHIP_H / 2;
		return svg`
			${renderChildStem(
				`${idPrefix}-stem-${item.id}`,
				parentRightX,
				parentMidY,
				childX,
				childMidY,
				colour,
			)}
			${renderChildChip(item, childX, y, autoScale, decimalPlaces)}
		`;
	});
}

/**
 * Hierarchical house vs cars load split.
 *
 * Total load → two group hubs only (Cars / House). Children nest under their
 * parent via stems — never as siblings of the hubs in a flat grid.
 * Prefer compact + wide.
 */
export const renderLoadGroupElements = (
	data: DataDto,
	config: detailedPowerFlowCardConfig,
	mode: LayoutMode = 'full',
) => {
	if (!data.showLoadSplit) {
		return html``;
	}

	const { auto_scale, dynamic_colour } = config.load;
	const wide = !!config.wide;
	const {
		decimalPlaces,
		loadColour,
		flowColour,
		housePower,
		carPower,
		houseColour,
		carColour,
		houseIcon,
		carIcon,
		houseName,
		carName,
		largeLoads,
		carLoads,
		loadShowDaily,
		loadLineWidth,
		minLineWidth,
	} = data;

	const flowStroke = dynamic_colour ? flowColour : loadColour;
	const dotRadius = Math.min(
		2 + loadLineWidth + Math.max(minLineWidth - 2, 0),
		8,
	);
	const housePowerLabel = formatPower(housePower, auto_scale, decimalPlaces);
	const carPowerLabel = formatPower(carPower, auto_scale, decimalPlaces);

	/*
	 * Compact (preferred with wide): tee off total-load box (~374,218.5).
	 * Full: tee off essential path end (~371,118).
	 * Hubs stack vertically; children nest to the RIGHT of each hub only.
	 */
	const coords =
		mode === 'compact'
			? {
					carsPath: wide
						? 'M 374 218.5 L 405 218.5 L 405 125 L 430 125'
						: 'M 374 218.5 L 395 218.5 L 395 125 L 410 125',
					housePath: wide
						? 'M 374 218.5 L 405 218.5 L 405 290 L 430 290'
						: 'M 374 218.5 L 395 218.5 L 395 290 L 410 290',
					carsBoxX: wide ? 430 : 410,
					carsBoxY: 110,
					houseBoxX: wide ? 430 : 410,
					houseBoxY: 275,
					// Icon Y sits just above the power box (centred in X via hubIconX).
					carsIconY: 110 - HUB_ICON_SIZE - 2,
					houseIconY: 275 - HUB_ICON_SIZE - 2,
					// Daily sits under the House hub label, left of child column.
					dailyX: wide ? 430 : 410,
					dailyValueY: 331,
					dailyLabelY: 344,
				}
			: {
					carsPath: wide
						? 'M 371 118 L 395 118 L 395 48 L 420 48'
						: 'M 371 118 L 385 118 L 385 48 L 400 48',
					housePath: wide
						? 'M 371 118 L 395 118 L 395 178 L 420 178'
						: 'M 371 118 L 385 118 L 385 178 L 400 178',
					carsBoxX: wide ? 420 : 400,
					carsBoxY: 33,
					houseBoxX: wide ? 420 : 400,
					houseBoxY: 163,
					carsIconY: 33 - HUB_ICON_SIZE - 2,
					houseIconY: 163 - HUB_ICON_SIZE - 2,
					dailyX: wide ? 420 : 400,
					dailyValueY: 215,
					dailyLabelY: 228,
				};

	return html`
		<svg id="LoadGroups" style="overflow: visible;">
			<!-- ===== Cars hub (upper branch) ===== -->
			${renderPath(
				'lg-cars-line',
				coords.carsPath,
				true,
				flowStroke,
				loadLineWidth,
			)}
			${renderCircle(
				'lg-cars-dot',
				dotRadius,
				carPower <= 0 ? 'transparent' : flowStroke,
				data.durationCur['load'] || 4,
				'0;1',
				'#lg-cars-line',
				config.load.invert_flow === true,
			)}
			${renderColouredIcon(
				config.load_groups?.car_entity,
				carIcon,
				carColour,
				hubIconX(coords.carsBoxX),
				coords.carsIconY,
				HUB_ICON_SIZE,
			)}
			<rect
				id="lg-cars-box"
				x="${coords.carsBoxX}"
				y="${coords.carsBoxY}"
				width="${HUB_BOX_W}"
				height="30"
				rx="4.5"
				ry="4.5"
				fill="none"
				stroke="${carColour}"
				pointer-events="all"
			/>
			${
				config.load_groups?.car_entity
					? createTextWithPopup(
							'lg-cars-power',
							coords.carsBoxX + 35,
							coords.carsBoxY + 19,
							true,
							'st3 st8',
							carColour,
							carPowerLabel,
							(e) => Utils.handlePopup(e, config.load_groups!.car_entity!),
						)
					: renderText(
							'lg-cars-power',
							coords.carsBoxX + 35,
							coords.carsBoxY + 19,
							true,
							'st3 st8',
							carColour,
							carPowerLabel,
						)
			}
			${renderText(
				'lg-cars-name',
				coords.carsBoxX + 35,
				coords.carsBoxY + 44,
				true,
				'st3 st8',
				carColour,
				carName,
			)}
			${renderNestedChildren(
				carLoads,
				coords.carsBoxX,
				coords.carsBoxY,
				30,
				carColour,
				auto_scale,
				decimalPlaces,
				'lg-cars',
			)}

			<!-- ===== House hub (lower branch) ===== -->
			${renderPath(
				'lg-house-line',
				coords.housePath,
				true,
				flowStroke,
				loadLineWidth,
			)}
			${renderCircle(
				'lg-house-dot',
				dotRadius,
				housePower <= 0 ? 'transparent' : flowStroke,
				data.durationCur['load'] || 4,
				'0;1',
				'#lg-house-line',
				config.load.invert_flow === true,
			)}
			${renderColouredIcon(
				config.load_groups?.house_entity,
				houseIcon,
				houseColour,
				hubIconX(coords.houseBoxX),
				coords.houseIconY,
				HUB_ICON_SIZE,
			)}
			<rect
				id="lg-house-box"
				x="${coords.houseBoxX}"
				y="${coords.houseBoxY}"
				width="${HUB_BOX_W}"
				height="30"
				rx="4.5"
				ry="4.5"
				fill="none"
				stroke="${houseColour}"
				pointer-events="all"
			/>
			${
				config.load_groups?.house_entity
					? createTextWithPopup(
							'lg-house-power',
							coords.houseBoxX + 35,
							coords.houseBoxY + 19,
							true,
							'st3 st8',
							houseColour,
							housePowerLabel,
							(e) => Utils.handlePopup(e, config.load_groups!.house_entity!),
						)
					: renderText(
							'lg-house-power',
							coords.houseBoxX + 35,
							coords.houseBoxY + 19,
							true,
							'st3 st8',
							houseColour,
							housePowerLabel,
						)
			}
			${renderText(
				'lg-house-name',
				coords.houseBoxX + 35,
				coords.houseBoxY + 44,
				true,
				'st3 st8',
				houseColour,
				houseName,
			)}
			${createTextWithPopup(
				'lg-house-daily-value',
				coords.dailyX,
				coords.dailyValueY,
				!loadShowDaily || !data.stateDayLoadEnergy.isValid(),
				'st10 left-align',
				houseColour,
				data.stateDayLoadEnergy.toPowerString(true, data.decimalPlacesEnergy),
				(e) => Utils.handlePopup(e, config.entities.day_load_energy_84),
				true,
			)}
			${renderText(
				'lg-house-daily-label',
				coords.dailyX,
				coords.dailyLabelY,
				!loadShowDaily,
				'st3 left-align',
				houseColour,
				config.load.label_daily_load || localize('common.daily_load'),
				true,
			)}
			${renderNestedChildren(
				largeLoads,
				coords.houseBoxX,
				coords.houseBoxY,
				30,
				houseColour,
				auto_scale,
				decimalPlaces,
				'lg-house',
			)}
		</svg>
	`;
};
