/** Verifies every Neon market tick exists in R2's compact hourly index. */
import { neon } from '@neondatabase/serverless';
import { readHour,configured } from '../lib/r2-storage.js';

if(!configured()||!process.env.DATABASE_URL)throw Error('Missing R2 or Neon credentials');
if(process.env.R2_COST_GUARD!=='enforced')throw Error('R2 cost guard must be enforced');
const sql=neon(process.env.DATABASE_URL);
const records=await sql`SELECT game_run,tick,received_at FROM cq_telemetry_snapshots ORDER BY id ASC`;
const groups=new Map();
for(const row of records){
  const at=new Date(row.received_at).toISOString();
  const key=at.slice(0,13);
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(row);
}
let present=0,missing=0;
const missingExamples=[];
for(const [key,group] of groups){
  const rows=await readHour(key.slice(0,10),key.slice(11,13));
  const keys=new Set(rows.map(row=>row.run+'|'+row.tick));
  for(const source of group){
    if(keys.has(source.game_run+'|'+source.tick))present++;
    else {missing++;if(missingExamples.length<8)missingExamples.push({hour:key,tick:source.tick});}
  }
}
console.log(JSON.stringify({sourceCount:records.length,matched:present,missing,hoursChecked:groups.size,
  examples:missingExamples,complete:missing===0},null,2));
if(missing)process.exitCode=1;
