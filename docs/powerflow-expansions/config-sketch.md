# Detailed Power Flow Card — expansions config sketch

Planned options for this fork. Types land in `src/types.ts` / `src/defaults.ts` under additive
namespaces so existing Detailed Power Flow Card configs keep working.

## Goals

- More energy flows (additional animated paths beyond today’s solar / battery / grid / load / aux)
- Split **house** vs **car** (EV) load on the diagram
- Break out large house loads (heat pump, water heater, …) with icons
- Configurable / addable icons for those loads

## Proposed surface (YAML)

```yaml
type: custom:detailed-power-flow-card

# Additive — omit to keep upstream behaviour
flows:
  # Extra named flow paths (future renderers). Empty = no change.
  extras: []
  # Example later:
  # - id: generator
  #   entity: sensor.generator_power
  #   colour: "#6b8e23"
  #   icon: mdi:engine

load_groups:
  # Split essential load into house vs car when both entities are set.
  # If only one is set, that bucket uses existing essential_power behaviour.
  house_entity: sensor.house_load_power # optional
  car_entity: sensor.ev_charger_power # optional
  show_split: true # when both present, draw two sinks

# Named large loads rendered as icon+power chips on the house side.
# Prefer this list over inventing load7..loadN fields.
large_loads:
  - id: heat_pump
    name: Heat pump
    entity: sensor.heat_pump_power
    icon: mdi:heat-pump # official MDI (mdi:snowflake remaps here)
    max_threshold: 5000 # optional colour trip
  - id: sunamp
    name: Sunamp
    entity: sensor.sunamp_power
    icon: mdi:propane-tank # cylindrical tank (mdi:water-boiler remaps)

# Individual vehicles under the Cars sink (same chip shape as large_loads).
car_loads:
  - id: tesla
    name: Tesla
    entity: sensor.tesla_charge_power
    icon: mdi:car-side # (mdi:ev-station / mdi:car-electric remap)
  - id: puma
    name: Puma
    entity: sensor.ford_puma_charge_power
    icon: mdi:car-side

# Optional — known ids use official @mdi/svg glyphs.
# Image URLs still override. Keys match large_loads[].id / car_loads[].id.
icons:
  house: mdi:home-outline
  car: mdi:car-side
  heat_pump: mdi:heat-pump
  sunamp: mdi:propane-tank
```

**Modern MDI (shipped as official path data):** `house` → `mdi:home-outline`; `car`/`cars`/`tesla`/`puma` → `mdi:car-side`; `heat_pump` → `mdi:heat-pump`; `sunamp`/`tank`/`water_heater` → `mdi:propane-tank`. Legacy keys remap automatically.

Worked example: [`docs/examples/house-cars-load-split.yaml`](../examples/house-cars-load-split.yaml).

## TypeScript landing spot

Add optional fields on `detailedPowerFlowCardConfig` (do not require them):

```ts
flows?: {
  extras?: Array<{
    id: string;
    entity: string;
    colour?: string;
    icon?: string;
  }>;
};

load_groups?: {
  house_entity?: string;
  car_entity?: string;
  show_split?: boolean;
};

large_loads?: Array<{
  id: string;
  name: string;
  entity: string;
  icon?: string;
  max_threshold?: number;
}>;

car_loads?: Array<{
  id: string;
  name: string;
  entity: string;
  icon?: string;
  max_threshold?: number;
}>;

icons?: Record<string, string>;
```

Defaults: all omitted / empty — identical to upstream rendering.

## Implementation status

1. ~~Types + defaults~~ (landed)
2. ~~House vs car split using `load_groups`~~ (landed; reuses essential-load layout)
3. ~~`large_loads` / `car_loads` list renderer~~ (cap 4 per side; prefer `wide: true`)
4. ~~`icons` merge helper~~ (`resolveNodeIcon` in `src/helpers/load-groups.ts`)
5. ~~Modern official MDI split icons~~ (`src/helpers/load-split-icons.ts`; `@mdi/svg` glyphs + legacy remaps)
6. `flows.extras` paths once layout space is defined (still future)

## Compatibility

- Keep card custom element name and HACS `type` stable unless packaging is intentionally renamed later.
- Upstream credit and MIT license stay in README / LICENSE.
