// src/utils/landUnits.js

export const LAND_AREA_UNITS = [
  { value: "Acres", label: "Acres (ac)", sqftFactor: 43560 },
  { value: "Guntas", label: "Guntas (Karnataka / South India)", sqftFactor: 1089 },
  { value: "Sq. Ft.", label: "Square Feet (sq. ft.)", sqftFactor: 1 },
  { value: "Sq. Yards", label: "Square Yards / Gaj", sqftFactor: 9 },
  { value: "Cents", label: "Cents (South India)", sqftFactor: 435.6 },
  { value: "Sq. Meters", label: "Square Meters (sq. m.)", sqftFactor: 10.7639 },
  { value: "Hectares", label: "Hectares (ha)", sqftFactor: 107639 },
  { value: "Bigha", label: "Bigha", sqftFactor: 27225 },
];

export const BUILTUP_AREA_UNITS = [
  { value: "Sq. Ft.", label: "Square Feet (sq. ft.)" },
  { value: "Sq. Meters", label: "Square Meters (sq. m.)" },
  { value: "Sq. Yards", label: "Square Yards (Gaj)" },
];

/**
 * Parses a combined area string (e.g. "1.5 Acres", "10 Guntas", "2400 sq.ft", "2.5")
 * into numeric value and unit.
 */
export function parseAreaAndUnit(rawStr, defaultUnit = "Acres") {
  if (rawStr === null || rawStr === undefined) {
    return { value: "", unit: defaultUnit };
  }
  const str = String(rawStr).trim();
  if (!str) {
    return { value: "", unit: defaultUnit };
  }

  // Check matching unit keywords
  const lower = str.toLowerCase();
  let matchedUnit = defaultUnit;

  if (lower.includes("acre")) {
    matchedUnit = "Acres";
  } else if (lower.includes("gunta")) {
    matchedUnit = "Guntas";
  } else if (lower.includes("yard") || lower.includes("gaj")) {
    matchedUnit = "Sq. Yards";
  } else if (lower.includes("cent")) {
    matchedUnit = "Cents";
  } else if (lower.includes("meter") || lower.includes("metre") || lower.includes("sq. m") || lower.includes("sq m")) {
    matchedUnit = "Sq. Meters";
  } else if (lower.includes("hectare") || lower.includes("ha")) {
    matchedUnit = "Hectares";
  } else if (lower.includes("bigha")) {
    matchedUnit = "Bigha";
  } else if (lower.includes("sq.ft") || lower.includes("sqft") || lower.includes("sq ft") || lower.includes("feet") || lower.includes("foot")) {
    matchedUnit = "Sq. Ft.";
  }

  // Extract numeric portion
  const match = str.match(/[\d.]+/);
  const numVal = match ? match[0] : str;

  return { value: numVal, unit: matchedUnit };
}

/**
 * Calculates regional equivalents for a given land measurement.
 */
export function getLandConversionsPreview(value, unit) {
  const num = parseFloat(String(value ?? "").trim());
  if (isNaN(num) || num <= 0) return null;

  const foundUnit = LAND_AREA_UNITS.find((u) => u.value === unit) || LAND_AREA_UNITS[0];
  const sqft = num * foundUnit.sqftFactor;

  const acres = sqft / 43560;
  const guntas = sqft / 1089;
  const sqMeters = sqft / 10.7639;

  const parts = [];

  if (unit !== "Acres" && acres >= 0.01) {
    parts.push(`≈ ${Number(acres.toFixed(2))} Acres`);
  }
  if (unit !== "Guntas" && guntas >= 0.1) {
    parts.push(`≈ ${Number(guntas.toFixed(1))} Guntas`);
  }
  if (unit !== "Sq. Ft.") {
    parts.push(`≈ ${Math.round(sqft).toLocaleString("en-IN")} sq. ft.`);
  }
  if (unit !== "Sq. Meters") {
    parts.push(`≈ ${Math.round(sqMeters).toLocaleString("en-IN")} sq. m.`);
  }

  return parts.slice(0, 3).join("  •  ");
}

/**
 * Formats land area for display on Property cards and detail pages.
 * Handles both string with unit ("1 Acre") and raw numbers.
 */
export function formatLandArea(rawStr) {
  if (!rawStr && rawStr !== 0) return null;
  const str = String(rawStr).trim();
  if (!str || str === "0") return null;

  // If already contains letters, format numbers with comma
  if (/[a-zA-Z]/.test(str)) {
    return str;
  }

  // If raw number: if >= 500, default sq.ft, else acres
  const num = parseFloat(str);
  if (isNaN(num) || num <= 0) return str;

  if (num < 100) {
    return `${num} ${num === 1 ? "Acre" : "Acres"}`;
  }
  return `${num.toLocaleString("en-IN")} sq. ft.`;
}

/**
 * Formats built-up area for display.
 */
export function formatBuiltupArea(rawStr) {
  if (!rawStr && rawStr !== 0) return null;
  const str = String(rawStr).trim();
  if (!str || str === "0") return null;

  if (/[a-zA-Z]/.test(str)) {
    return str;
  }

  const num = parseFloat(str);
  if (isNaN(num) || num <= 0) return str;

  return `${num.toLocaleString("en-IN")} sq. ft.`;
}
