export function getTtlInHoursFromNow(hoursFromNow: number): number {
  return Math.floor((Date.now() / 1000) + (hoursFromNow * 3600));
}
