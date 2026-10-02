export const lengthUnits = ["mm", "cm", "m", "km", "in", "ft"] as const;
export const massUnits = ["g", "kg", "lb", "oz"] as const;
export const temperatureUnits = ["C", "F", "K"] as const;
export const unitGroups = ["length", "mass", "temperature"] as const;

export type LengthUnit = (typeof lengthUnits)[number];
export type MassUnit = (typeof massUnits)[number];
export type TemperatureUnit = (typeof temperatureUnits)[number];
export type Unit = LengthUnit | MassUnit | TemperatureUnit;
export type UnitGroup = (typeof unitGroups)[number];

const lengthInMeters: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
};

const massInKilograms: Record<MassUnit, number> = {
  g: 0.001,
  kg: 1,
  lb: 0.45359237,
  oz: 0.028349523125,
};

export function unitsFor(group: UnitGroup): readonly Unit[] {
  if (group === "length") {
    return lengthUnits;
  }
  if (group === "mass") {
    return massUnits;
  }
  return temperatureUnits;
}

export function convertUnit(
  value: number,
  from: Unit,
  to: Unit,
): { ok: true; value: number } | { ok: false; reason: "mismatch" | "belowAbsoluteZero" } {
  if (!Number.isFinite(value)) {
    return { ok: false, reason: "mismatch" };
  }
  if (isLength(from) && isLength(to)) {
    return { ok: true, value: (value * lengthInMeters[from]) / lengthInMeters[to] };
  }
  if (isMass(from) && isMass(to)) {
    return { ok: true, value: (value * massInKilograms[from]) / massInKilograms[to] };
  }
  if (isTemperature(from) && isTemperature(to)) {
    const kelvin = toKelvin(value, from);
    if (kelvin < -1e-6) {
      return { ok: false, reason: "belowAbsoluteZero" };
    }
    return { ok: true, value: fromKelvin(kelvin < 0 ? 0 : kelvin, to) };
  }
  return { ok: false, reason: "mismatch" };
}

function isLength(unit: Unit): unit is LengthUnit {
  return (lengthUnits as readonly string[]).includes(unit);
}

function isMass(unit: Unit): unit is MassUnit {
  return (massUnits as readonly string[]).includes(unit);
}

function isTemperature(unit: Unit): unit is TemperatureUnit {
  return (temperatureUnits as readonly string[]).includes(unit);
}

function toKelvin(value: number, unit: TemperatureUnit): number {
  if (unit === "C") {
    return value + 273.15;
  }
  if (unit === "F") {
    return ((value - 32) * 5) / 9 + 273.15;
  }
  return value;
}

function fromKelvin(value: number, unit: TemperatureUnit): number {
  if (unit === "C") {
    return value - 273.15;
  }
  if (unit === "F") {
    return (value - 273.15) * (9 / 5) + 32;
  }
  return value;
}
