import { neon } from '@neondatabase/serverless';
import { buildHealthView } from '../lib/health-core.js';
import { latestSnapshot, readDays } from '../lib/r2-storage.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control','public, s-maxage=15, stale-while-revalidate=30');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  if(process.env.TELEMETRY_BACKEND!=='r2' && !process.env.DATABASE_URL)return res.status(503).json({error:'Telemetry storage unavailable'});
  try {
    if(process.env.TELEMETRY_BACKEND==='r2'){
      const state=await latestSnapshot();
      if(!state) return res.status(200).json(buildHealthView({now:new Date()}));
      const now=new Date();
      const cutoff24=now.getTime()-86_400_000;
      const min24=new Date(cutoff24).toISOString();
      const rows=await readDays(min24,now.toISOString(),3);
      const lastDay=rows.filter(row=>Date.parse(row.receivedAt)>=cutoff24);
      const buckets=new Map();
      for(const row of lastDay){
        const minute=row.receivedAt.slice(0,16)+':00.000Z';
        buckets.set(minute,(buckets.get(minute)||0)+1);
      }
      return res.status(200).json(buildHealthView({
        now,latestAt:state.receivedAt,
        minuteRows:Array.from(buckets,([minute,samples])=>({minute,samples})),
        snapshots24h:lastDay.length,
        delivery:state.payload.delivery||null
      }));
    }
    const sql=neon(process.env.DATABASE_URL);
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
