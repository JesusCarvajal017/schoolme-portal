import { TuiDay } from "@taiga-ui/cdk/date-time";

export function formatTuiDay(day:TuiDay): string {
  const d = String(day.day).padStart(2, '0');        // 01–31
  const m = String(day.month).padStart(2, '0');      // 01–12  👈 Ojo: TuiDay.month ya es 1–12
  const y = day.year;
  return `${y}-${m}-${d}`;
}

export function parseTuiDay(input: string | null | undefined): TuiDay | null {
  if (!input) return null;
  const m = input.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
  if (!m) return null;

  const y = +m[1], mo = +m[2], d = +m[3];
  try {
    return new TuiDay(y, mo, d);   // mes 1–12 (Taiga)
  } catch {
    return null;
  }
}