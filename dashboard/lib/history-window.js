/* Dependency-free time window calculations shared by history storage APIs. */
export const HISTORY_RANGE_MINUTES = Object.freeze({
  '1h': 60, '6h': 360, '12h': 720, '24h': 1440,
  '7d': 10080, '30d': 43200, '1y': 525600, all: 0
});
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

export function rangeStart(end,range,firstAt) {
  const minutes=HISTORY_RANGE_MINUTES[range];
  if(minutes===undefined)throw Error('Invalid history range');
  if(range==='all')return firstAt;
  const last=Date.parse(end),start=Date.parse(firstAt);
  if(!Number.isFinite(last)||!Number.isFinite(start))throw Error('Invalid history timestamp');
  return new Date(Math.max(start,last-minutes*MINUTE_MS)).toISOString();
}

export function hourlyKeysBetween(first,last) {
  const start=Date.parse(first),end=Date.parse(last);
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<start)return [];
  const from=Math.floor(start/HOUR_MS),to=Math.floor(end/HOUR_MS);
  // Detailed R2 reads are restricted to windows of up to three days.
  if(to-from>72)throw Error('Hourly history window too large');
  return Array.from({length:to-from+1},(_,i)=>
    new Date((from+i)*HOUR_MS).toISOString().slice(0,13));
}
