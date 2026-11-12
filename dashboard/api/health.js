import { neon } from '@neondatabase/serverless';
import { buildHealthView } from '../lib/health-core.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control','public, s-maxage=15, stale-while-revalidate=30');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  if(!process.env.DATABASE_URL)return res.status(503).json({error:'Telemetry storage unavailable'});
  const sql=neon(process.env.DATABASE_URL);
  try {
    // Metadata only. No credentials, game saves, or raw prices exposed here.
    const [latestRows, minuteRows, dayRows]=await Promise.all([
      sql`SELECT received_at, payload->'delivery' AS delivery
          FROM cq_telemetry_snapshots ORDER BY received_at DESC LIMIT 1`,
      sql`SELECT date_trunc('minute',received_at) AS minute, count(*)::int AS samples
          FROM cq_telemetry_snapshots
          WHERE received_at >= now() - interval '60 minutes'
          GROUP BY 1 ORDER BY 1`,
      sql`SELECT count(*)::int AS samples FROM cq_telemetry_snapshots
          WHERE received_at >= now() - interval '24 hours'`
    ]);
    return res.status(200).json(buildHealthView({
      now:new Date(),
      latestAt:latestRows[0]?.received_at||null,
      minuteRows,
      snapshots24h:dayRows[0]?.samples||0,
      delivery:latestRows[0]?.delivery||null
    }));
  }catch(error){
    console.error('Telemetry health database error',error?.message);
    return res.status(503).json({error:'Telemetry health unavailable'});
  }
}
