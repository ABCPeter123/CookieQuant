import { neon } from '@neondatabase/serverless';
import { latestSnapshot, readDays, downsample, rangeStart } from '../lib/r2-storage.js';
import { HISTORY_RANGE_MINUTES } from '../lib/history-window.js';

const DASHBOARD_ORIGIN = 'https://cookiequant-dashboard.vercel.app';
const RANGES = HISTORY_RANGE_MINUTES;
const SAMPLES = 450;
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Public, read-only telemetry. The game ingestion endpoint stays write-authenticated.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (process.env.TELEMETRY_BACKEND !== 'r2' && !process.env.DATABASE_URL) return res.status(503).json({ error: 'Storage unavailable' });
  const range = typeof req.query?.range === 'string' ? req.query.range : '24h';
  if (!Object.hasOwn(RANGES, range)) return res.status(400).json({ error: 'Invalid history range' });
  const minutes = RANGES[range];
  try {
    if (process.env.TELEMETRY_BACKEND === 'r2') {
      const state = await latestSnapshot();
      if (!state) return res.status(200).json({range,sampled:0,total:0,firstAt:null,lastAt:null,history:[]});
      const begin=rangeStart(state.receivedAt,range,state.firstAt);
      const rows=(await readDays(begin,state.receivedAt)).filter(item=>
        Date.parse(item.receivedAt)>=Date.parse(begin) &&
        Date.parse(item.receivedAt)<=Date.parse(state.receivedAt));
      const sampled=downsample(rows,SAMPLES);
      return res.status(200).json({
        range, sampled:sampled.length,
        total:range==='all' ? Math.max(state.total||0,rows.length) : rows.length,
        firstAt:range==='all' ? state.firstAt : (rows[0]?.receivedAt||null),
        lastAt:state.receivedAt,
        history:sampled.map(row=>({receivedAt:row.receivedAt,tick:row.tick,market:{goods:row.market.goods}}))
      });
    }
    const sql = neon(process.env.DATABASE_URL);
    // Sample price points for display without deleting or truncating historical records.
    const rows = await sql`
      WITH ranked AS (
        SELECT id, received_at, row_number() OVER (ORDER BY received_at ASC, id ASC) AS row_num,
          count(*) OVER () AS total,
          min(received_at) OVER () AS first_at,
          max(received_at) OVER () AS last_at
        FROM cq_telemetry_snapshots
        WHERE (${minutes}::int = 0 OR received_at >= NOW() - (${minutes}::int * INTERVAL '1 minute'))
      ), picked AS (
        SELECT DISTINCT ON (bucket) id, total, first_at, last_at
        FROM (
          SELECT id, received_at, total, first_at, last_at,
            floor((row_num - 1)::numeric * ${SAMPLES} / total) AS bucket
          FROM ranked
        ) AS mapped
        ORDER BY bucket, received_at DESC, id DESC
      )
      SELECT s.received_at, s.tick,
        (SELECT jsonb_agg(jsonb_build_object('id', stock->'id', 'price', stock->'price'))
         FROM jsonb_array_elements(COALESCE(s.payload->'market'->'goods', '[]'::jsonb)) AS stock) AS goods,
        p.total, p.first_at, p.last_at
      FROM picked p
      JOIN cq_telemetry_snapshots s ON s.id = p.id
      ORDER BY s.received_at ASC, s.id ASC
      LIMIT ${SAMPLES}`;
    const history = rows.map(row => ({
      receivedAt: row.received_at,
      tick: row.tick,
      market: { goods: row.goods || [] }
    }));
    return res.status(200).json({
      range, sampled: history.length,
      total: rows.length ? Number(rows[0].total) : 0,
      firstAt: rows[0]?.first_at ?? null,
      lastAt: rows[0]?.last_at ?? null,
      history
    });
  } catch (error) {
    if (error?.name === 'R2BudgetError') return res.status(507).json({error: 'R2 safety budget stopped reads', reason: error.message});
    console.error('Telemetry history database error', error?.message);
    return res.status(503).json({ error: 'Telemetry history unavailable' });
  }
}
