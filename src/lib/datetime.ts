import { DateTime } from 'luxon'

export function wallTimeToStartMs(dateYmd: string, timeHm: string, timeZone: string): number {
  const [y, m, d] = dateYmd.split('-').map(Number)
  const [hh, mm] = timeHm.split(':').map(Number)
  const dt = DateTime.fromObject(
    { year: y, month: m, day: d, hour: hh, minute: mm },
    { zone: timeZone },
  )
  return dt.toMillis()
}

export function startMsToWallParts(
  startMs: number,
  timeZone: string,
): { date: string; time: string } {
  const dt = DateTime.fromMillis(startMs, { zone: timeZone })
  return {
    date: dt.toFormat('yyyy-MM-dd'),
    time: dt.toFormat('HH:mm'),
  }
}

export const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC',
] as const
