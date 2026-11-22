import { html, svg } from 'lit';
import { Utils } from '../../../helpers/utils';
import { renderIcon } from '../../../helpers/render-icon';
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

function formatPower(
	power: number,
	autoScale: boolean,
	decimalPlaces: number,
): string {
	return autoScale
		? `${Utils.convertValue(power, decimalPlaces) || 0}`
		: `${power || 0} ${UnitOfPower.WATT}`;
}

function renderColouredIcon(
	entity: string | undefined,
	icon: string | undefined,
	colour: string,
	x: number,
	y: number,
) {
	if (!icon) {
		return svg``;
	}
	const body = svg`
		<foreignObject x="${x}" y="${y}" width="30" height="30" display="inline">
			<div xmlns="http://www.w3.org/1999/xhtml" style="position: fixed; width: 30px; height: 30px;">
				<ha-icon icon="${icon}" style="color: ${colour}; --mdc-icon-size: 20px;"></ha-icon>
			</div>
		</foreignObject>
	`;
	if (entity) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity)}>
				${body}
			</a>
		`;
	}
	return body;
}

function renderLoadChip(
	item: NamedLoadItem,
	x: number,
	y: number,
	autoScale: boolean,
	decimalPlaces: number,
) {
	return svg`
		<g id="named-load-${item.id}">
			<rect
				x="${x}"
				y="${y}"
				width="70"
				height="22"
				rx="4.5"
				ry="4.5"
				fill="none"
				stroke="${item.colour}"
				pointer-events="all"
			/>
			${renderColouredIcon(item.entity, item.icon, item.colour, x + 20, y - 28)}
			${renderText(
				`named-load-${item.id}-name`,
				x + 35,
				y + 32,
				true,
				'st3 st8',
				item.colour,
				item.name,
			)}
			${createTextWithPopup(
				`named-load-${item.id}-power`,
				x + 35,
				y + 15,
				item.state.isValid(),
				'st3 st8',
				item.colour,
				item.state.toPowerString(autoScale, decimalPlaces),
				(e) => Utils.handlePopup(e, item.entity),
			)}
		</g>
	`;
}

function renderLoadChips(
	items: NamedLoadItem[],
	startX: number,
	startY: number,
	horizontal: boolean,
	gap: number,
	autoScale: boolean,
	decimalPlaces: number,
) {
	return items.map((item, index) =>
		renderLoadChip(
			item,
			horizontal ? startX + index * gap : startX,
			horizontal ? startY : startY + index * gap,
			autoScale,
			decimalPlaces,
		),
	);
}

/**
 * House vs cars load split. Reuses essential-load visual language (rects, icons,
 * animated flow dots) and only renders when `data.showLoadSplit` is true.
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

	// Full: branch from essential total-load box (~270,118) / path end ~371,118.
	// Compact: branch from compact load box (~339,218).
	const coords =
		mode === 'full'
			? {
					carsBoxX: wide ? 420 : 390,
					carsBoxY: 28,
					houseBoxX: wide ? 420 : 390,
					houseBoxY: 150,
					carsPath: wide
						? 'M 371 118 L 371 45 L 420 45'
						: 'M 371 118 L 371 45 L 390 45',
					housePath: wide
						? 'M 371 118 L 371 165 L 420 165'
						: 'M 371 118 L 371 165 L 390 165',
					carChipX: wide ? 510 : 390,
					carChipY: wide ? 8 : 72,
					houseChipX: wide ? 510 : 390,
					houseChipY: wide ? 200 : 214,
					chipGap: wide ? 82 : 58,
					chipHorizontal: wide,
					dailyX: wide ? 455 : 425,
					dailyLabelY: 198,
					dailyValueY: 185,
					carsIconX: wide ? 428 : 398,
					carsIconY: 0,
					houseIconX: wide ? 428 : 398,
					houseIconY: 122,
				}
			: {
					carsBoxX: wide ? 420 : 406,
					carsBoxY: 95,
					houseBoxX: wide ? 420 : 406,
					houseBoxY: 250,
					carsPath: wide
						? 'M 339 218 L 390 218 L 390 110 L 420 110'
						: 'M 339 218 L 374 218 L 374 110 L 406 110',
					housePath: wide
						? 'M 339 218 L 390 218 L 390 265 L 420 265'
						: 'M 339 218 L 374 218 L 374 265 L 406 265',
					carChipX: wide ? 510 : 406,
					carChipY: wide ? 55 : 145,
					houseChipX: wide ? 510 : 406,
					houseChipY: wide ? 300 : 300,
					chipGap: wide ? 82 : 58,
					chipHorizontal: wide,
					dailyX: wide ? 455 : 441,
					dailyLabelY: 298,
					dailyValueY: 285,
					carsIconX: wide ? 428 : 414,
					carsIconY: 67,
					houseIconX: wide ? 428 : 414,
					houseIconY: 222,
				};

	return html`
		<svg id="LoadGroups" style="overflow: visible;">
			${renderPath('lg-cars-line', coords.carsPath, true, flowStroke, loadLineWidth)}
			${renderCircle(
				'lg-cars-dot',
				dotRadius,
				carPower <= 0 ? 'transparent' : flowStroke,
				data.durationCur['load'] || 4,
				'0;1',
				'#lg-cars-line',
				config.load.invert_flow === true,
			)}
			<rect
				id="lg-cars-box"
				x="${coords.carsBoxX}"
				y="${coords.carsBoxY}"
				width="70"
				height="30"
				rx="4.5"
				ry="4.5"
				fill="none"
				stroke="${carColour}"
				pointer-events="all"
			/>
			${renderIcon(
				config.load_groups?.car_entity,
				carIcon,
				'loadgroup-car-icon',
				coords.carsIconX,
				coords.carsIconY,
				36,
				36,
			)}
			${renderText(
				'lg-cars-name',
				coords.carsBoxX + 35,
				coords.carsBoxY + 42,
				true,
				'st3 st8',
				carColour,
				carName,
			)}
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
			${renderLoadChips(
				carLoads,
				coords.carChipX,
				coords.carChipY,
				coords.chipHorizontal,
				coords.chipGap,
				auto_scale,
				decimalPlaces,
			)}
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
			<rect
				id="lg-house-box"
				x="${coords.houseBoxX}"
				y="${coords.houseBoxY}"
				width="70"
				height="30"
				rx="4.5"
				ry="4.5"
				fill="none"
				stroke="${houseColour}"
				pointer-events="all"
			/>
			${renderIcon(
				config.load_groups?.house_entity,
				houseIcon,
				'loadgroup-house-icon',
				coords.houseIconX,
				coords.houseIconY,
				36,
				36,
			)}
			${renderText(
				'lg-house-name',
				coords.houseBoxX + 35,
				coords.houseBoxY + 42,
				true,
				'st3 st8',
				houseColour,
				houseName,
			)}
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
				'lg-house-daily-label',
				coords.dailyX,
				coords.dailyLabelY,
				!loadShowDaily,
				'st3 left-align',
				houseColour,
				config.load.label_daily_load || localize('common.daily_load'),
				true,
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
			${renderLoadChips(
				largeLoads,
				coords.houseChipX,
				coords.houseChipY,
				coords.chipHorizontal,
				coords.chipGap,
				auto_scale,
				decimalPlaces,
			)}
		</svg>
	`;
};
