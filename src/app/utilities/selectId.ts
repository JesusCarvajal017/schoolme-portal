export function idToNameHelper(
  value: number | string | null | undefined,
  map: Map<number, string>
): string {
  if (value == null) return '';
  const id = typeof value === 'string' ? Number(value) : (value as number);
  return map.get(id) ?? '';
}