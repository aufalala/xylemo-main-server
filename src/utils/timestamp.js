import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { TIMEZONE } from '../config/_env.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getTimestamp(tz = Intl.DateTimeFormat().resolvedOptions().timeZone) {  
  return dayjs().tz(tz).format('YYYY-MM-DD HH:mm:ss.SSS');
}

export function isToday(utcMs) {
  const tz = TIMEZONE || "UTC";
  const nowTz = dayjs().tz(tz);
  const inputTz = dayjs(utcMs).tz(tz);

  return nowTz.isSame(inputTz, "day");
}

export function getDayRange(date = dayjs().tz(TIMEZONE)) {
  const start = date.startOf("day").valueOf();  // ms
  const end = date.endOf("day").valueOf();      // ms

  return { start, end };
}