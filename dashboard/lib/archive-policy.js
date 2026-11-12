/*
 * R2 tiered history.
 * Every publisher observation is retained in the compressed daily price/position
 * index. Full stochastic paths are sampled hourly, or all are preserved during
 * a one-time Neon migration when preserveFull=true.
 */
export const FULL_SCENARIO_INTERVAL_TICKS = 60;

export function shouldArchiveScenarios(receivedAt, tick, options = {}) {
  if (options.preserveFull === true) return true;
  const timestamp = new Date(receivedAt);
  if (!Number.isFinite(timestamp.getTime())) throw Error('Invalid observation timestamp');
  // Native market ticks give a stable fallback if uploads shift from the
  // top of the UTC hour.
  return timestamp.getUTCMinutes() === 0 ||
    (Number.isSafeInteger(tick) && tick >= 0 && tick % FULL_SCENARIO_INTERVAL_TICKS === 0);
}

export function compactSnapshot(payload, receivedAt) {
  if (!payload || !payload.market || !Array.isArray(payload.market.goods)) {
    throw Error('Invalid market snapshot');
  }
  // Preserve *all* quotes, holdings, model summaries, execution decisions,
  // game and automation status. Only the bulky simulation trajectories leave
  // the per-observation index.
  return {
    receivedAt, run: payload.run, tick: payload.market.tick,
    game: payload.game, stats: payload.stats, delivery: payload.delivery,
    modules: payload.modules,
    market: {
      ...payload.market,
      goods: payload.market.goods.map(({ paths, ...summary }) => ({...summary}))
    }
  };
}
