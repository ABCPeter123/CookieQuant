export const HEALTH_WINDOW_MINUTES = 60;
export const HEALTH_LIVE_SECONDS = 150;
export const HEALTH_DELAYED_SECONDS = 600;

export function classifyFeed(ageSeconds) {
  if (ageSeconds === null || !Number.isFinite(ageSeconds)) return 'waiting';
  if (ageSeconds <= HEALTH_LIVE_SECONDS) return 'live';
  if (ageSeconds <= HEALTH_DELAYED_SECONDS) return 'delayed';
  return 'offline';
}

/**
 * These figures describe server-observed stored snapshots, not client-side
 * uptime or an end-to-end packet delivery rate. Repeated game ticks may update
 * existing rows.
 */
export function buildHealthView({now, latestAt = null, minuteRows = [], snapshots24h = 0, delivery = null}) {
  const nowMs = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (!Number.isFinite(nowMs)) throw new Error('Invalid server clock');
  const lastMs = latestAt ? new Date(latestAt).getTime() : NaN;
  const lastReceivedAt = Number.isFinite(lastMs) ? new Date(lastMs).toISOString() : null;
  const ageSeconds = lastReceivedAt ? Math.max(0, Math.floor((nowMs-lastMs)/1000)) : null;
  const base = Math.floor(nowMs / 60000) * 60000 - (HEALTH_WINDOW_MINUTES-1)*60000;
  const observed = new Map();
  for (const row of minuteRows) {
    const time = new Date(row.minute).getTime();
    if (!Number.isFinite(time)) continue;
    const bucket = Math.floor(time/60000)*60000;
    const count = Number(row.samples) || 0;
    if (count > 0) observed.set(bucket,(observed.get(bucket)||0)+count);
  }
  const minutes = Array.from({length:HEALTH_WINDOW_MINUTES},(_,i)=>{
    const at = base + i*60000;
    return {at: new Date(at).toISOString(), snapshots: observed.get(at)||0};
  });
  const coveredMinutes = minutes.filter(p=>p.snapshots>0).length;
  // Exclude the current partial UTC minute. This is the last ten fully
  // elapsed minutes, not an uptime estimate or a fabricated heartbeat.
  const completed10 = minutes.slice(-11,-1);
  const recorded10 = completed10.filter(row=>row.snapshots>0).length;
  const cadence = {
    targetIntervalSeconds:60,
    recentWindowMinutes:completed10.length,
    recentRecordedMinutes:recorded10,
    recentMissedMinutes:completed10.length-recorded10,
    status: !lastReceivedAt ? 'no-data'
      : recorded10>=9 ? 'on-target' : 'gaps'
  };
  return {
    status: classifyFeed(ageSeconds),
    serverTime: new Date(nowMs).toISOString(),
    lastReceivedAt,
    ageSeconds,
    recordedMinutesLastHour: coveredMinutes,
    cadence,
    snapshotsLastHour: minutes.reduce((sum,p)=>sum+p.snapshots,0),
    snapshotsLast24Hours: Math.max(0,Number(snapshots24h)||0),
    minutes,
    publisher: delivery && typeof delivery === 'object' && delivery.clientVersion
      ? {
          clientVersion: delivery.clientVersion,
          startedAt: delivery.startedAt||null,
          attempts: Number(delivery.attempts)||0,
          failedAttempts: Number(delivery.failedAttempts)||0,
          recoveries: Number(delivery.recoveries)||0,
          retriesBeforeSuccess: Number(delivery.retriesBeforeSuccess)||0,
          lastFailureAt: delivery.lastFailureAt||null,
          lastFailureKind: delivery.lastFailureKind||'',
          lastRecoveryAt: delivery.lastRecoveryAt||null,
          schedulerLagMs:Math.min(86_400_000,Math.max(0,Number(delivery.schedulerLagMs)||0)),
          schedulerSource:typeof delivery.schedulerSource==='string'
            ? delivery.schedulerSource.slice(0,20):'',
          tabHiddenAtAttempt:delivery.tabHiddenAtAttempt===true
        }
      : null
  };
}
