import { neon } from '@neondatabase/serverless';
import { archiveSnapshot } from '../lib/r2-storage.js';
import { createHash, timingSafeEqual } from 'node:crypto';

const CORS_ORIGINS = new Set(['https://orteil.dashnet.org', 'http://orteil.dashnet.org', 'https://cookiequant-dashboard.vercel.app']);
const MAX_BODY = 180000;
const MAX_RECORDS = 120;

function authorize(req, secret) {
  if (!secret || typeof secret !== 'string' || secret.length < 32) return false;
  const provided = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]{32,150})$/)?.[1];
  if (!provided) return false;
  const left = createHash('sha256').update(provided).digest();
  const right = createHash('sha256').update(secret).digest();
  return timingSafeEqual(left, right);
}
function cors(req, res, methods) {
  const origin = req.headers.origin;
  if (origin && CORS_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', methods);
    res.setHeader('Access-Control-Max-Age', '600');
  }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return !origin || CORS_ORIGINS.has(origin);
}
function send(res, code, json) {
  res.status(code).json(json);
}
function finite(number, lower = -1e100, upper = 1e100) {
  const n = Number(number);
  return Number.isFinite(n) ? Math.max(lower, Math.min(upper, n)) : 0;
}
function text(value, max = 160) { return typeof value === 'string' ? value.slice(0, max) : ''; }
function validRun(value) { return typeof value === 'string' && /^[a-zA-Z0-9_-]{8,90}$/.test(value); }
function toRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1) return null;
  if (!validRun(value.run) || !value.market || !Array.isArray(value.market.goods) || value.market.goods.length > 30) return null;
  const market = value.market;
  if (!Number.isSafeInteger(market.tick) || market.tick < 0) return null;
  const goods = market.goods.map(item => {
    if (!Number.isInteger(item.id) || item.id < 0 || item.id > 64) return null;
    const paths = Array.isArray(item.paths)
      ? item.paths.slice(0, 256).map(v => finite(v, 0, 1e9)) : [];
    return {
      id: item.id, symbol: text(item.symbol, 8), name: text(item.name, 36),
      price: finite(item.price, 0), stock: finite(item.stock, 0, 1e8),
      max: finite(item.max, 0, 1e8), mode: finite(item.mode, 0, 5),
      trend: finite(item.trend, -1000, 1000), mean: finite(item.mean, 0),
      low: finite(item.low, 0), high: finite(item.high, 0),
      win: finite(item.win, 0, 1), buy: item.buy === true,
      target: finite(item.target, 0, 1e8), basis: finite(item.basis, 0),
      unknown: item.unknown === true, paths
    };
  });
  if (goods.some(g => !g)) return null;
  const moduleInfo = value.modules || {};
  const stats = value.stats || {};
  const rawDelivery = value.delivery && typeof value.delivery === 'object' && !Array.isArray(value.delivery)
    ? value.delivery : {};
  const safeIso = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)
    && Number.isFinite(Date.parse(v)) ? new Date(v).toISOString() : null;
  const delivery = {
    clientVersion: text(rawDelivery.clientVersion, 32),
    startedAt: safeIso(rawDelivery.startedAt),
    attempts: finite(rawDelivery.attempts, 0, 1e9),
    failedAttempts: finite(rawDelivery.failedAttempts, 0, 1e9),
    retriesBeforeSuccess: finite(rawDelivery.retriesBeforeSuccess, 0, 1e6),
    recoveries: finite(rawDelivery.recoveries, 0, 1e9),
    lastFailureAt: safeIso(rawDelivery.lastFailureAt),
    lastFailureKind: /^(timeout|network|http-\d{3})$/.test(rawDelivery.lastFailureKind || '')
      ? rawDelivery.lastFailureKind : '',
    lastRecoveryAt: safeIso(rawDelivery.lastRecoveryAt)
  };
  return {
    version: 1, run: value.run, emittedAt: text(value.emittedAt, 40),
    delivery,
    game: { version: text(value.game?.version, 30), resets: finite(value.game?.resets, 0, 1e7), cookies: finite(value.game?.cookies), cps: finite(value.game?.cps), prestige: finite(value.game?.prestige) },
    market: {
      tick: market.tick, level: finite(market.level, 0, 100), brokers: finite(market.brokers, 0, 1e5),
      fee: finite(market.fee, 0, 1), riskLimit: finite(market.riskLimit, 0, 1),
      budgetPercent: finite(market.budgetPercent, 0, 100), horizon: finite(market.horizon, 0, 20),
      modeledReturn: finite(market.modeledReturn, -1, 100),
      modeledRisk: finite(market.modeledRisk, 0, 100),
      autoTrading: market.autoTrading === true,
      goods,
    },
    stats: {
      trades: finite(stats.trades, 0, 1e9), realizedDollars: finite(stats.realizedDollars),
      feesDollars: finite(stats.feesDollars, 0), nativeProfit: finite(stats.nativeProfit),
      lastAction: text(stats.lastAction, 260)
    },
    modules: {
      stock: text(moduleInfo.stock, 450), garden: text(moduleInfo.garden, 450),
      godzamok: text(moduleInfo.godzamok, 450), ascension: text(moduleInfo.ascension, 450),
      dragon: text(moduleInfo.dragon, 450)
    }
  };
}
export default async function handler(req, res) {
  if (!cors(req, res, 'POST, OPTIONS')) return send(res, 403, { error: 'Origin not allowed' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  if (!authorize(req, process.env.TELEMETRY_WRITE_KEY)) return send(res, 401, { error: 'Invalid ingestion key' });
  if (process.env.TELEMETRY_BACKEND !== 'r2' && !process.env.DATABASE_URL) return send(res, 503, { error: 'Storage unavailable' });
  const size = Number(req.headers['content-length']);
  if (size > MAX_BODY) return send(res, 413, { error: 'Payload too large' });
  let body = req.body;
  if (typeof body === 'string') {
    if (body.length > MAX_BODY) return send(res, 413, { error: 'Payload too large' });
    try { body = JSON.parse(body); } catch { return send(res, 400, { error: 'Invalid JSON' }); }
  }
  if (JSON.stringify(body || {}).length > MAX_BODY) return send(res, 413, { error: 'Payload too large' });
  const payload = toRecord(body);
  if (!payload) return send(res, 400, { error: 'Invalid telemetry schema' });
  try {
    if (process.env.TELEMETRY_BACKEND === 'r2') {
      const result = await archiveSnapshot(payload);
      return send(res, 200, { ok: true, tick: payload.market.tick, receivedAt: result.receivedAt, backend: 'r2' });
    }
    const sql = neon(process.env.DATABASE_URL);
    const record = JSON.stringify(payload);
    await sql`INSERT INTO cq_telemetry_snapshots (game_run, tick, payload)
      VALUES (${payload.run}, ${payload.market.tick}, ${record}::jsonb)
      ON CONFLICT (game_run, tick) DO UPDATE
      SET payload = EXCLUDED.payload, received_at = now()`;
    // Append or update the current tick. Stored history has no time-based expiration.
    return send(res, 200, { ok: true, tick: payload.market.tick, receivedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Telemetry ingest database error', error?.message);
    return send(res, 503, { error: 'Telemetry storage unavailable' });
  }
}
