import { neon } from '@neondatabase/serverless';
import { latestSnapshot } from '../lib/r2-storage.js';

const ORIGIN = 'https://cookiequant-dashboard.vercel.app';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Public, read-only telemetry. The game ingestion endpoint stays write-authenticated.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (process.env.TELEMETRY_BACKEND !== 'r2' && !process.env.DATABASE_URL) return res.status(503).json({ error: 'Storage unavailable' });
  try {
    if (process.env.TELEMETRY_BACKEND === 'r2') {
      const state = await latestSnapshot();
      return res.status(200).json({
        connected: Boolean(state),
        latest: state ? {...state.payload, receivedAt: state.receivedAt} : null,
        history: state?.history||[],
        serverTime: new Date().toISOString()
      });
    }
    const sql = neon(process.env.DATABASE_URL);
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
    if (error?.name === 'R2BudgetError') return res.status(507).json({error: 'R2 safety budget stopped reads', reason: error.message});
    console.error('Telemetry read database error', error?.message);
    return res.status(503).json({ error: 'Telemetry history unavailable' });
  }
}
