import { CSSResultGroup, css, html } from 'lit';

export const styles: CSSResultGroup = css`
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		padding: 5px;
	}

	.card {
		border-radius: var(--ha-card-border-radius, 10px);
		box-shadow: var(
			--ha-card-box-shadow,
			0px 0px 0px 1px rgba(0, 0, 0, 0.12),
			0px 0px 0px 0px rgba(0, 0, 0, 0.12),
			0px 0px 0px 0px rgba(0, 0, 0, 0.12)
		);
		background: var(--ha-card-background, var(--card-background-color, white));
		border-width: var(--ha-card-border-width);
		padding: 0px;
	}

	text {
		text-anchor: middle;
		dominant-baseline: middle;
	}

	.left-align {
		text-anchor: start;
	}
	.right-align {
		text-anchor: end;
	}
	.st1 {
		fill: #ff9b30;
	}
	.st2 {
		fill: #f3b3ca;
	}
	.st3 {
		font-size: 9px;
	}
	.st4 {
		font-size: 14px;
	}
	.st5 {
		fill: #969696;
	}
	.st6 {
		fill: #5fb6ad;
	}
	.st7 {
		fill: #5490c2;
	}
	.st8 {
		font-weight: 500;
	}
	.st9 {
		fill: #959595;
	}
	.st10 {
		font-size: 16px;
	}
	.st11 {
		fill: transparent;
	}
	.st12 {
		display: none;
	}
	.st13 {
		font-size: 22px;
	}
	.st14 {
		font-size: 12px;
	}
	.remaining-energy {
		font-size: 9px;
	}

	/* —— Photo glass-tile mode —— */
	.pf-photo-card {
		overflow: hidden;
		background: transparent;
	}

	.pf-photo-stage {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		min-height: 220px;
		border-radius: var(--ha-card-border-radius, 12px);
		overflow: hidden;
		isolation: isolate;
	}

	.pf-photo-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(8, 12, 18, 0.15) 0%,
			rgba(8, 12, 18, 0.35) 55%,
			rgba(8, 12, 18, 0.55) 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	.pf-photo-title {
		position: absolute;
		top: 3%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 4;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
		pointer-events: none;
		white-space: nowrap;
	}

	.pf-photo-flows {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		pointer-events: none;
	}

	.pf-flow-base {
		fill: none;
		stroke-width: 2.2;
		stroke-opacity: 0.35;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.pf-flow-dash {
		fill: none;
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 8 10;
		animation: pf-flow-march linear infinite;
	}

	.pf-flow-dash--static {
		animation: none;
		stroke-dasharray: none;
		stroke-opacity: 0.85;
	}

	.pf-flow-idle {
		fill: none;
		stroke-width: 1.5;
		stroke-opacity: 0.18;
		stroke-dasharray: 4 8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	@keyframes pf-flow-march {
		to {
			stroke-dashoffset: -36;
		}
	}

	.pf-photo-tiles {
		position: absolute;
		inset: 0;
		z-index: 3;
	}

	.pf-glass-tile {
		position: absolute;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		min-width: 92px;
		padding: 10px 12px 8px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 14px;
		background: rgba(12, 16, 24, calc(var(--pf-tile-opacity, 0.55) * 0.92));
		-webkit-backdrop-filter: blur(var(--pf-tile-blur, 12px));
		backdrop-filter: blur(var(--pf-tile-blur, 12px));
		box-shadow:
			0 4px 18px rgba(0, 0, 0, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
		color: #f2f5f8;
		cursor: pointer;
		font: inherit;
		line-height: 1.15;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.pf-glass-tile:hover,
	.pf-glass-tile:focus-visible {
		outline: none;
		border-color: color-mix(
			in srgb,
			var(--pf-tile-accent, var(--pf-accent, #5fb6ad)) 65%,
			white 20%
		);
		box-shadow:
			0 6px 22px rgba(0, 0, 0, 0.45),
			0 0 0 1px
				color-mix(in srgb, var(--pf-tile-accent, #5fb6ad) 40%, transparent);
		transform: translate(-50%, -50%) scale(1.03);
	}

	.pf-glass-tile--lg {
		min-width: 112px;
		padding: 12px 14px 10px;
		border-radius: 16px;
	}

	.pf-glass-tile--sm {
		min-width: 78px;
		padding: 8px 10px 6px;
		border-radius: 12px;
	}

	.pf-glass-tile--idle {
		opacity: 0.72;
	}

	.pf-glass-tile__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2px;
		color: var(--pf-tile-accent, var(--pf-accent, #5fb6ad));
	}

	.pf-photo-icon,
	.pf-photo-icon-img {
		display: block;
		width: 26px;
		height: 26px;
		object-fit: contain;
	}

	.pf-glass-tile--lg .pf-photo-icon,
	.pf-glass-tile--lg .pf-photo-icon-img {
		width: 32px;
		height: 32px;
	}

	.pf-glass-tile--sm .pf-photo-icon,
	.pf-glass-tile--sm .pf-photo-icon-img {
		width: 22px;
		height: 22px;
	}

	.pf-glass-tile__power {
		font-size: 15px;
		font-weight: 650;
		letter-spacing: 0.01em;
		color: #fff;
	}

	.pf-glass-tile--sm .pf-glass-tile__power {
		font-size: 13px;
	}

	.pf-glass-tile__label {
		font-size: 11px;
		font-weight: 500;
		opacity: 0.88;
		text-transform: none;
	}

	.pf-glass-tile__sub {
		font-size: 10px;
		opacity: 0.7;
		margin-top: 1px;
		max-width: 120px;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 480px) {
		.pf-glass-tile {
			min-width: 72px;
			padding: 7px 8px 6px;
		}
		.pf-glass-tile__power {
			font-size: 12px;
		}
		.pf-glass-tile__label {
			font-size: 10px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pf-flow-dash {
			animation: none;
			stroke-dasharray: none;
		}
		.pf-glass-tile {
			transition: none;
		}
	}
`;

export const getDynamicStyles = (data) => html`
	<style>
		.essload1-icon {
			color: ${data.dynamicColourEssentialLoad1} !important;
			--mdc-icon-size: 32px;
		}

		.essload2-icon {
			color: ${data.dynamicColourEssentialLoad2} !important;
			--mdc-icon-size: 32px;
		}

		.essload1-small-icon {
			color: ${data.dynamicColourEssentialLoad1} !important;
			--mdc-icon-size: 20px;
		}

		.essload2-small-icon {
			color: ${data.dynamicColourEssentialLoad2} !important;
			--mdc-icon-size: 20px;
		}

		.essload3-small-icon {
			color: ${data.dynamicColourEssentialLoad3} !important;
			--mdc-icon-size: 20px;
		}

		.essload4-small-icon {
			color: ${data.dynamicColourEssentialLoad4} !important;
			--mdc-icon-size: 20px;
		}

		.essload5-small-icon {
			color: ${data.dynamicColourEssentialLoad5} !important;
			--mdc-icon-size: 20px;
		}

		.essload6-small-icon {
			color: ${data.dynamicColourEssentialLoad6} !important;
			--mdc-icon-size: 20px;
		}

		.grid-icon {
			color: ${data.customGridIconColour} !important;
			--mdc-icon-size: 64px;
		}

		.essload1-icon-full {
			color: ${data.dynamicColourEssentialLoad1} !important;
			--mdc-icon-size: 36px;
		}

		.loadgroup-house-icon {
			color: ${data.houseColour} !important;
			--mdc-icon-size: 32px;
		}

		.loadgroup-car-icon {
			color: ${data.carColour} !important;
			--mdc-icon-size: 32px;
		}

		.loadgroup-house-load-icon {
			color: ${data.loadColour} !important;
			--mdc-icon-size: 20px;
		}

		.loadgroup-car-load-icon {
			color: ${data.loadColour} !important;
			--mdc-icon-size: 20px;
		}

		.aux-icon {
			color: ${data.auxDynamicColour} !important;
			--mdc-icon-size: 70px;
		}

		.aux-small-icon-1 {
			color: ${data.auxDynamicColourLoad1} !important;
			--mdc-icon-size: 24px;
		}

		.aux-small-icon-2 {
			color: ${data.auxDynamicColourLoad2} !important;
			--mdc-icon-size: 24px;
		}

		.aux-off-icon {
			color: ${data.auxOffColour} !important;
			--mdc-icon-size: 70px;
		}

		.nonessload1-icon {
			color: ${data.dynamicColourNonEssentialLoad1} !important;
			--mdc-icon-size: 32px;
		}

		.nonessload2-icon {
			color: ${data.dynamicColourNonEssentialLoad2} !important;
			--mdc-icon-size: 32px;
		}

		.nonessload3-icon {
			color: ${data.dynamicColourNonEssentialLoad3} !important;
			--mdc-icon-size: 32px;
		}

		.noness-icon {
			color: ${data.gridColour} !important;
			--mdc-icon-size: 70px;
		}

		.grid-icon-small {
			color: ${data.customGridIconColour} !important;
			--mdc-icon-size: 32px;
		}
	</style>
`;
