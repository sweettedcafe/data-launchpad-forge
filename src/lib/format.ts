// Smart cell formatter for query results.
// Detects date/timestamp columns by name AND value heuristics so epoch numbers
// (e.g. 1723420800000) render as ISO dates instead of giant integers.

const DATE_COL_RE = /(^|_)(date|at|on|time|timestamp|day|month|year|dob|birthday|created|updated|signup|order_date|ship_date)(_|$)/i;

function toDate(value: any): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    // Heuristic: ms since epoch (>= year 2000 in ms) or seconds
    const ms = value > 1e12 ? value : value > 1e9 ? value * 1000 : null;
    if (ms == null) return null;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "bigint") return toDate(Number(value));
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  return null;
}

function fmt(d: Date, withTime: boolean) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  if (!withTime) return `${y}-${m}-${day}`;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

export function formatCell(column: string, value: any): React.ReactNode {
  if (value == null) return null;
  const looksLikeDateCol = DATE_COL_RE.test(column);
  if (looksLikeDateCol) {
    const d = toDate(value);
    if (d) {
      const hasTime = /(time|timestamp|_at$|^at$)/i.test(column);
      return fmt(d, hasTime);
    }
  }
  if (typeof value === "bigint") return String(value);
  if (typeof value === "number" && !Number.isFinite(value)) return String(value);
  return String(value);
}
