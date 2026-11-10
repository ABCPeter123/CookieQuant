import { neon } from '@neondatabase/serverless';
import { createHash, timingSafeEqual } from 'node:crypto';

const ORIGIN = 'https://cookiequant-dashboard.vercel.app';
function authorized(req) {
  const secret = process.env.TELEMETRY_READ_KEY;
  const incoming = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]{32,150})$/)?.[1];
  if (!secret || !incoming || secret.length < 32) return false;
  return timingSafeEqual(createHash('sha256').update(secret).digest(), createHash('sha256').update(incoming).digest());
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const origin = req.headers.origin;
  if (origin && origin !== ORIGIN) return res.status(403).json({ error: 'Origin not allowed' });
  if (origin === ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!authorized(req)) return res.status(401).json({ error: 'Invalid viewer key' });
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'Storage unavailable' });
  const sql = neon(process.env.DATABASE_URL);
  try {
    const rows = await sql`SELECT received_at, tick, payload
      FROM cq_telemetry_snapshots
      ORDER BY received_at DESC LIMIT 120`;
    const latest = rows[0] ? { ...rows[0].payload, receivedAt: rows[0].received_at } : null;
    const history = rows.reverse().map(row => ({
      receivedAt: row.received_at,
      tick: row.tick,
      game: row.payload.game,
      stats: row.payload.stats,
      market: {
        tick: row.payload.market.tick,
        modeledReturn: row.payload.market.modeledReturn,
        modeledRisk: row.payload.market.modeledRisk,
        goods: row.payload.market.goods.map(({ id, symbol, price, stock, target, mean }) =>
          ({ id, symbol, price, stock, target, mean }))
      }
    }));
    return res.status(200).json({ connected: Boolean(latest), latest, history, serverTime: new Date().toISOString() });
  } catch (error) {
    console.error('Telemetry read database error', error?.message);
    return res.status(503).json({ error: 'Telemetry history unavailable' });
  }
}
