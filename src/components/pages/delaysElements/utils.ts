
export function formatPercentage(value: number, total: number, decimals = 2): string {
  if (total === 0) return (0).toFixed(decimals);
  return ((value * 100) / total).toFixed(decimals);
}

export function getMinMaxDates(data: { delayDate: string }[]): { minDate: Date; maxDate: Date } {
  const timestamps = data.map(d => new Date(d.delayDate).getTime());
  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));
  return { minDate, maxDate };
}

export function daysBetween(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
