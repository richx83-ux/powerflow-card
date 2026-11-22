# Detailed Power Flow Card

A Home Assistant Lovelace card for **detailed inverter power-flow visualization** — solar, battery, grid, and loads — with animated flows and configurable layout.

Works with many inverter brands when you have the required sensors.

| | |
| --- | --- |
| **HACS name** | Detailed Power Flow Card |
| **Lovelace type** | `custom:detailed-power-flow-card` |
| **Resource** | `detailed-power-flow-card.js` |

[![HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=richx83-ux&repository=powerflow-card&category=plugin)
![GitHub release](https://img.shields.io/github/v/release/richx83-ux/powerflow-card?style=for-the-badge)

## Quick start (YAML)

```yaml
type: custom:detailed-power-flow-card
```

After installing, add a dashboard resource pointing at `detailed-power-flow-card.js`, then add the card above (or pick **Detailed Power Flow Card** in the UI).

## Installation

### HACS (recommended)

1. Install [HACS](https://hacs.xyz/).
2. Add custom repository `richx83-ux/powerflow-card` (category: Lovelace), or use the button above.
3. Download **Detailed Power Flow Card**.
4. Restart Home Assistant / reload resources if needed.

### Manual

1. Create `www/detailed-power-flow-card/`.
2. Copy `detailed-power-flow-card.js` into that folder.
3. Add a Lovelace resource, e.g. `/local/detailed-power-flow-card/detailed-power-flow-card.js` (append `?ver=7.6.2` when updating to bust cache).
4. Add a card with `type: custom:detailed-power-flow-card`.

## Features

- Three layouts: `compact`, `lite`, or `full` (optional wide 16:9 view).
- Animated power flow from sensor values (supports inverted battery, AUX, and grid power).
- Dynamic battery image from SOC; grid connected status.
- Battery runtime from capacity + shutdown SOC (optional).
- Daily totals, MPPT labels, AUX / non-essential loads, energy cost, solar sell.
- Clickable entities for more-info; scalable via `card_height` / `card_width`.
- Inverter model presets for status messages (e.g. Sunsynk, Lux, Goodwe, Solis, and others).

## Planned expansions (this fork)

- More animated energy flows beyond the stock diagram.
- House vs EV/car load split.
- Large house loads (heat pump, water heater, …) with icons.
- Configurable / addable icons.

See [`docs/powerflow-expansions/config-sketch.md`](docs/powerflow-expansions/config-sketch.md).

## Documentation

- Fork notes: [`docs/`](docs/)
- Upstream configuration reference: [slipx06 docs](https://slipx06.github.io/sunsynk-power-flow-card/index.html)
- Sensor mapping examples: [upstream wiki](https://github.com/slipx06/sunsynk-power-flow-card/wiki)

## Screenshots

_Compact_

![compact](https://github.com/slipx06/sunsynk-power-flow-card/assets/7227275/b1e437a8-d1f7-4d6a-a549-1cc908950002)

_Lite_

![lite](https://github.com/slipx06/sunsynk-power-flow-card/assets/7227275/d25c621c-2607-445f-b3a3-865930387a05)

_Full_

![full](https://github.com/slipx06/sunsynk-power-flow-card/assets/7227275/fdcce257-e7b5-4874-926c-17e911e83eba)

_Wide (2 batteries)_

![{4D3F02C5-3DC5-4995-AD99-7478E6DE5557}](https://github.com/user-attachments/assets/af169593-c73f-469e-bc8b-62fb72b8af43)

## Credits

Based on [slipx06/sunsynk-power-flow-card](https://github.com/slipx06/sunsynk-power-flow-card) (MIT). This fork is distributed as **Detailed Power Flow Card** with Lovelace type `custom:detailed-power-flow-card`.
