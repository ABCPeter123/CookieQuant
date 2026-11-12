// Conservative application-level Cloudflare R2 budget policy.
// This is a circuit breaker for this application, not a Cloudflare billing cap.
// A rolling 31-day window covers arbitrary month and billing-cycle boundaries.
export const BUDGET_LIMITS = Object.freeze({
  storageBytes: 7_000_000_000,
  classA31Days: 650_000,
  classB31Days: 3_000_000
});
export const BUDGET_WINDOW_DAYS = 31;
export function budgetDay(now) {
  const date = new Date(now);
  if (!Number.isFinite(date.getTime())) throw Error('Invalid budget clock');
  return date.toISOString().slice(0, 10);
}
export function applyReservation(existing, reservation, now = new Date()) {
  const day = budgetDay(now);
  if (!existing && (reservation?.bootstrapAllowed !== true))
    return {ok:false,reason:'R2 budget not initialized; use explicit empty-bucket bootstrap'};
  const state = existing || {version:1,bytesReserved:0,days:{},createdAt:now.toISOString()};
  if (state.version !== 1 || typeof state.days !== 'object' || !state.days ||
      !Number.isSafeInteger(state.bytesReserved) || state.bytesReserved < 0)
    return {ok:false,reason:'R2 budget ledger corrupt; fail closed'};
  const rawA = reservation?.classA || 0;
  const rawB = reservation?.classB || 0;
  const rawBytes = reservation?.bytes || 0;
  if (![rawA,rawB,rawBytes].every(n => Number.isSafeInteger(n) && n >= 0))
    return {ok:false,reason:'Invalid R2 reservation'};
  // Each reservation itself performs 1 GET and 1 conditional PUT to R2.
  const classA = rawA + 1, classB = rawB + 1;
  const end = Date.parse(day+'T00:00:00Z');
  const days = {};
  for (const [stamp,counts] of Object.entries(state.days)) {
    const t = Date.parse(stamp+'T00:00:00Z');
    if (!Number.isFinite(t) || t > end || t < end-(BUDGET_WINDOW_DAYS-1)*86_400_000) continue;
    if (!counts || !Number.isSafeInteger(counts.a) || !Number.isSafeInteger(counts.b) ||
        counts.a < 0 || counts.b < 0) return {ok:false,reason:'R2 budget ledger corrupt; fail closed'};
    days[stamp]={a:counts.a,b:counts.b};
  }
  const a = Object.values(days).reduce((sum,c)=>sum+c.a,0);
  const b = Object.values(days).reduce((sum,c)=>sum+c.b,0);
  if (state.bytesReserved+rawBytes > BUDGET_LIMITS.storageBytes)
    return {ok:false,reason:'Storage reserve exceeded (7 GB hard stop)'};
  if (a+classA > BUDGET_LIMITS.classA31Days)
    return {ok:false,reason:'Rolling Class A operation budget exhausted'};
  if (b+classB > BUDGET_LIMITS.classB31Days)
    return {ok:false,reason:'Rolling Class B operation budget exhausted'};
  days[day]={a:(days[day]?.a||0)+classA,b:(days[day]?.b||0)+classB};
  return {ok:true,next:{
    version:1,createdAt:state.createdAt||now.toISOString(),
    updatedAt:now.toISOString(),bytesReserved:state.bytesReserved+rawBytes,days
  }};
}
