const finite = v => Number.isFinite(Number(v));
const val = v => Number(v);

export function percentile(sorted, proportion) {
  if (!Array.isArray(sorted) || !sorted.length) return null;
  const at = Math.max(0, Math.min(1, proportion)) * (sorted.length - 1);
  const a = Math.floor(at);
  const b = Math.ceil(at);
  return sorted[a] + (sorted[b] - sorted[a]) * (at - a);
}

export function forecastMetrics(good, buyFee = 0) {
  const price = val(good?.price);
  const scenarios = Array.isArray(good?.paths) ?
    good.paths.map(val).filter(v => Number.isFinite(v) && v >= 0) : [];
  if (!(price > 0) || scenarios.length < 8) return null;
  const sorted = scenarios.slice().sort((a,b)=>a-b);
  const mean = scenarios.reduce((a,b)=>a+b,0)/scenarios.length;
  const variance = scenarios.reduce((a,b)=>a+(b-mean)**2,0)/scenarios.length;
  const q05 = percentile(sorted,.05), q25=percentile(sorted,.25),
    median=percentile(sorted,.5), q75=percentile(sorted,.75),
    q95=percentile(sorted,.95);
  const pProfit=scenarios.filter(v=>v>price*(1+buyFee)).length/scenarios.length;
  const worstCount=Math.max(1,Math.ceil(scenarios.length*.05));
  const tailMean=sorted.slice(0,worstCount).reduce((a,b)=>a+b,0)/worstCount;
  return {
    id:good.id, symbol:String(good.symbol||''), name:String(good.name||''),
    price, expected:finite(good.mean)?val(good.mean):mean,
    edgePct:(mean/price-1)*100, mean:mean,
    q05,q25,median,q75,q95,
    q05Pct:(q05/price-1)*100, q95Pct:(q95/price-1)*100,
    medianPct:(median/price-1)*100,
    sigmaPct:(Math.sqrt(variance)/price)*100,
    tailReturnPct:(tailMean/price-1)*100,
    pProfit, count:scenarios.length, values:scenarios,
    stock:Number(good.stock)||0, target:Number(good.target)||0, buy:good.buy===true,
    unknown:good.unknown===true
  };
}

export function correlation(a,b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length < 8 || a.length !== b.length) return null;
  let count=0,sa=0,sb=0,saa=0,sbb=0,sab=0;
  for(let i=0;i<a.length;i++){
    const x=Number(a[i]), y=Number(b[i]);
    if(!Number.isFinite(x)||!Number.isFinite(y))return null;
    count++;sa+=x;sb+=y;saa+=x*x;sbb+=y*y;sab+=x*y;
  }
  const vA=saa-sa*sa/count,vB=sbb-sb*sb/count;
  if(vA<=1e-10||vB<=1e-10)return null;
  return Math.max(-1,Math.min(1,(sab-sa*sb/count)/Math.sqrt(vA*vB)));
}

export function normalizedHistory(history,goods) {
  const first=new Map();
  const output=[];
  const ordered=(Array.isArray(history)?history:[]).slice().sort((a,b)=>
    Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
  for(const row of ordered){
    const time=Date.parse(row.receivedAt);
    if(!Number.isFinite(time))continue;
    const prices=new Map();
    for(const good of row.market?.goods||[]){
      const price=Number(good.price);
      if(!Number.isFinite(price)||price<=0)continue;
      prices.set(good.id,price);
      if(!first.has(good.id))first.set(good.id,price);
    }
    output.push({time,prices});
  }
  return {observations:output,first};
}
