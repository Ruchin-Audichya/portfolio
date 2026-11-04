// @ts-nocheck
// Client-side behaviour for the homepage: knowledge graph, pharmacy map, count-up, copy email.
export function initHome(raEl: HTMLElement): () => void {
  let alive = true;
  const timers: number[] = [];
  const raf = (f) => { if (alive) requestAnimationFrame(f); };

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(raEl).getPropertyValue(n).trim();

  /* ---------- knowledge graph hero ---------- */
  const cv = document.getElementById('graph'), ctx = cv.getContext('2d'), cap = document.getElementById('gcap');
  const P = [ // projects
    ['MediFast AI',1],['MediAtlas',1],['Placify AI',1],['Yatra Sync',1],['Find My Stipend',1],['AWS Labs',1]];
  const S = ['RAG','ChromaDB','BM25','LangChain','Knowledge Graph','MCP','CatBoost','FastAPI','React','Node.js','Python','TypeScript','AWS','PostgreSQL','MongoDB','Gemini','Boto3','Docker'];
  const E = {
    'MediFast AI':['RAG','ChromaDB','BM25','LangChain','Knowledge Graph','Node.js','MongoDB','Python'],
    'MediAtlas':['Knowledge Graph','MCP','Python','FastAPI','Docker'],
    'Placify AI':['CatBoost','FastAPI','React','PostgreSQL','Python','AWS','Node.js'],
    'Yatra Sync':['TypeScript','React','PostgreSQL'],
    'Find My Stipend':['TypeScript','Gemini','React','Python','FastAPI'],
    'AWS Labs':['AWS','Boto3','Python','Docker']};
  const nodes = [], idx = {};
  P.forEach(([n]) => { idx[n] = nodes.length; nodes.push({n, p:1}); });
  S.forEach(n => { idx[n] = nodes.length; nodes.push({n, p:0}); });
  const links = [];
  for (const p in E) E[p].forEach(s => links.push([idx[p], idx[s]]));
  nodes.forEach((d,i) => { const a = i/nodes.length*Math.PI*2*3.1; const r = d.p ? .18 : .36 + (i%3)*.04;
    d.x = .5 + Math.cos(a)*r; d.y = .5 + Math.sin(a)*r; d.vx = d.vy = 0;
    d.deg = links.filter(l => l[0]===i||l[1]===i).length; });
  let W=0,H=0,dpr=1, hover=-1, drag=-1, t0=performance.now();
  function size(){ const b = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio||1);
    W = b.width; H = b.height; cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  new ResizeObserver(size).observe(cv); size();
  function step(){
    for (let i=0;i<nodes.length;i++){ const a = nodes[i];
      for (let j=i+1;j<nodes.length;j++){ const b = nodes[j];
        let dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy+1e-4, f=.00013/d2;
        a.vx+=dx*f; a.vy+=dy*f; b.vx-=dx*f; b.vy-=dy*f; } }
    links.forEach(([i,j]) => { const a=nodes[i], b=nodes[j]; const dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy)||1e-3, k=(d-.2)*.012;
      a.vx+=dx/d*k; a.vy+=dy/d*k; b.vx-=dx/d*k; b.vy-=dy/d*k; });
    nodes.forEach((d,i) => { d.vx += (.5-d.x)*.0035; d.vy += (.5-d.y)*.0035;
      if (i===drag) return; d.vx*=.86; d.vy*=.86; d.x+=d.vx; d.y+=d.vy;
      d.x=Math.max(.07,Math.min(.93,d.x)); d.y=Math.max(.07,Math.min(.9,d.y)); });
  }
  function draw(now){
    const t=(now-t0)/1000, rose=css('--rose'), sky=css('--sky'), line=css('--line'), fg=css('--fg'), muted=css('--muted'), sand=css('--sand');
    ctx.clearRect(0,0,W,H);
    const nb = new Set(); if (hover>=0){ nb.add(hover); links.forEach(([i,j]) => { if(i===hover) nb.add(j); if(j===hover) nb.add(i); }); }
    links.forEach(([i,j],k) => { const a=nodes[i], b=nodes[j]; const on = hover>=0 && (i===hover||j===hover);
      ctx.strokeStyle = on ? sky : line; ctx.globalAlpha = hover>=0 && !on ? .35 : 1; ctx.lineWidth = on?1.6:1;
      ctx.beginPath(); ctx.moveTo(a.x*W,a.y*H); ctx.lineTo(b.x*W,b.y*H); ctx.stroke();
      if (!reduce){ const u = (t*.22 + k*.137)%1; ctx.fillStyle = on?sky:sand; ctx.globalAlpha = hover>=0&&!on?.15:.75;
        ctx.beginPath(); ctx.arc((a.x+(b.x-a.x)*u)*W,(a.y+(b.y-a.y)*u)*H,1.6,0,7); ctx.fill(); } });
    ctx.globalAlpha=1;
    nodes.forEach((d,i) => { const dim = hover>=0 && !nb.has(i); const r = d.p ? 7+d.deg*.6 : 3.2+d.deg*.7;
      ctx.globalAlpha = dim ? .3 : 1;
      if (d.p){ ctx.fillStyle = rose; ctx.beginPath(); ctx.arc(d.x*W,d.y*H,r,0,7); ctx.fill();
        ctx.strokeStyle = rose; ctx.globalAlpha = dim?.1:.3; ctx.beginPath(); ctx.arc(d.x*W,d.y*H,r+5+Math.sin(t*2+i)*1.5,0,7); ctx.stroke(); ctx.globalAlpha = dim?.3:1; }
      else { ctx.fillStyle = i===hover||nb.has(i)&&hover>=0 ? sky : muted; ctx.beginPath(); ctx.arc(d.x*W,d.y*H,r,0,7); ctx.fill(); }
      const showLabel = d.p || nb.has(i) || W>420;
      if (showLabel){ ctx.font = (d.p ? '600 13px ' : '400 11px ') + (d.p ? css('--display') : css('--mono'));
        ctx.fillStyle = d.p ? fg : (nb.has(i)&&hover>=0 ? fg : muted); ctx.textAlign='center';
        const tw=ctx.measureText(d.n).width/2+2; ctx.fillText(d.n, Math.max(tw,Math.min(W-tw,d.x*W)), d.y*H - r - 7); } });
    ctx.globalAlpha=1;
  }
  function loop(now){ step(); draw(now); raf(loop); }
  if (reduce){ for(let i=0;i<300;i++) step(); draw(performance.now()); timers.push(setInterval(()=>draw(performance.now()),250)); } else raf(loop);
  function pick(e){ const b=cv.getBoundingClientRect(), x=(e.clientX-b.left)/W, y=(e.clientY-b.top)/H; let best=-1, bd=.0025;
    nodes.forEach((d,i)=>{ const dd=(d.x-x)**2+(d.y-y)**2; if(dd<bd){bd=dd;best=i;} }); return {best,x,y}; }
  cv.addEventListener('pointermove', e => { const {best,x,y}=pick(e);
    if (drag>=0){ nodes[drag].x=x; nodes[drag].y=y; nodes[drag].vx=nodes[drag].vy=0; return; }
    hover=best; cv.style.cursor = best>=0?'pointer':'grab';
    if (best>=0){ const d=nodes[best]; const c=links.filter(l=>l[0]===best||l[1]===best).length;
      cap.textContent = d.p ? `${d.n} · uses ${c} tools` : `${d.n} · in ${c} project${c>1?'s':''}`; } else cap.textContent='hover a node'; });
  cv.addEventListener('pointerleave', ()=>{ hover=-1; cap.textContent='hover a node'; });
  cv.addEventListener('pointerdown', e => { const {best}=pick(e); if(best>=0){ drag=best; cv.setPointerCapture(e.pointerId);} });
  cv.addEventListener('pointerup', ()=>{ drag=-1; });

  /* ---------- agent run: map + steps, synced ---------- */
  const steps=[...document.querySelectorAll('#agent li')], reply=document.getElementById('reply'), rp=document.getElementById('replay');
  const mc=document.getElementById('pmap'), mx=mc.getContext('2d');
  const PH=[[.18,.28],[.72,.2],[.62,.76],[.3,.78],[.86,.48],[.1,.6],[.48,.14]], STOCK=[0,2,4], PICK=4, STEP_T=[.3,1.4,2.0,2.8,3.4], END=3.9;
  let MW=0,MH=0, start=-1e9;
  const sz=()=>{ const b=mc.getBoundingClientRect(), d=Math.min(2,devicePixelRatio||1); MW=b.width; MH=b.height; mc.width=MW*d; mc.height=MH*d; mx.setTransform(d,0,0,d,0,0); };
  new ResizeObserver(sz).observe(mc); sz();
  const sg=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))), ez=v=>1-Math.pow(1-v,3);
  function drawMap(now){
    const t=(now-start)/1000, k=Math.min(t,END+1), rose=css('--rose'), sky=css('--sky'), sand=css('--sand'), line=css('--line'), mu=css('--muted'), bgc=css('--bg');
    mx.clearRect(0,0,MW,MH); mx.strokeStyle=line; mx.lineWidth=1;
    for(let i=1;i<6;i++){ const y=MH*i/6+Math.sin(i)*6; mx.beginPath(); mx.moveTo(0,y); mx.lineTo(MW,y+8); mx.stroke(); }
    for(let i=1;i<9;i++){ const x=MW*i/9+Math.cos(i)*8; mx.beginPath(); mx.moveTo(x,0); mx.lineTo(x-10,MH); mx.stroke(); }
    const ux=MW*.45, uy=MH*.52, sc=sg(k,.6,1.6);
    if(sc>0&&sc<1){ mx.globalAlpha=1-sc; mx.strokeStyle=sky; mx.lineWidth=2; mx.beginPath(); mx.arc(ux,uy,sc*MW*.6,0,7); mx.stroke(); mx.globalAlpha=1; }
    const found=ez(sg(k,1.6,2.2)), go=ez(sg(k,2.2,3.0)), conf=ez(sg(k,3.0,3.4));
    const px=MW*PH[PICK][0], py=MH*PH[PICK][1];
    if(go>0){ mx.strokeStyle=rose; mx.lineWidth=2.5; mx.setLineDash([7,6]); mx.lineDashOffset=-now/40; mx.beginPath(); mx.moveTo(ux,uy); mx.lineTo(ux+(px-ux)*go,uy+(py-uy)*go); mx.stroke(); mx.setLineDash([]); }
    PH.forEach(([fx,fy],i)=>{ const x=MW*fx,y=MH*fy, st=STOCK.includes(i);
      mx.globalAlpha = st ? 1 : 1-found*.55; mx.fillStyle = i===PICK&&conf>0 ? rose : (st&&found>.5 ? sky : mu);
      mx.beginPath(); mx.roundRect(x-9,y-9,18,18,5); mx.fill(); mx.fillStyle=bgc; mx.fillRect(x-1.75,y-5.5,3.5,11); mx.fillRect(x-5.5,y-1.75,11,3.5); });
    mx.globalAlpha=1; mx.fillStyle=sand; mx.beginPath(); mx.arc(ux,uy,7,0,7); mx.fill();
    mx.strokeStyle=sand; mx.globalAlpha=.45; mx.beginPath(); mx.arc(ux,uy,13+Math.sin(now/260)*2.5,0,7); mx.stroke(); mx.globalAlpha=1;
    mx.font=`600 11px ${css('--mono')}`; mx.textAlign='center'; mx.fillStyle=sand; mx.fillText('You',ux,uy+26);
    if(conf>0){ const lab='600 m · ready'; mx.font=`600 11px ${css('--mono')}`; const w=mx.measureText(lab).width+18, bx=Math.min(MW-w-8,px-w/2), by=py-36;
      mx.globalAlpha=conf; mx.fillStyle=rose; mx.beginPath(); mx.roundRect(bx,by,w,22,11); mx.fill(); mx.fillStyle=bgc; mx.textAlign='left'; mx.fillText(lab,bx+9,by+15); mx.globalAlpha=1; }
    // sync steps + reply during a replay
    if(t<=END+.5){ steps.forEach((li,i)=>li.classList.toggle('done', t>=STEP_T[i])); reply.style.opacity = t>=END-.2 ? 1 : 0; rp.disabled = t<END; }
  }
  if(reduce){ drawMap(performance.now()); } else { (function ml(now){ drawMap(now); raf(ml); })(performance.now()); }
  rp.addEventListener('click', () => { if(reduce) return; start=performance.now(); });
  /* ---------- count-up (from visible resting values) ---------- */
  if (!reduce) document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count, dec = +(el.dataset.dec||0), suf = el.dataset.suf; let s=null;
    const io = new IntersectionObserver(([en]) => { if(!en.isIntersecting) return; io.disconnect();
      const run = now => { s ??= now; const p = Math.min(1,(now-s)/1100), e = 1-Math.pow(1-p,3);
        el.textContent = (end*e).toFixed(dec)+suf; if(p<1) raf(run); }; raf(run); });
    io.observe(el); });

  /* ---------- copy email ---------- */
  const cp = document.getElementById('copy');
  cp.addEventListener('click', () => { const t = document.getElementById('email').textContent;
    const ok = () => { cp.textContent='Copied'; setTimeout(()=>cp.textContent='Copy email',1600); };
    const fb = () => { const r=document.createRange(); r.selectNodeContents(document.getElementById('email')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); cp.textContent='Selected — press Ctrl+C'; };
    try { navigator.clipboard.writeText(t).then(ok, fb); } catch(e){ fb(); } });

  return () => { alive = false; timers.forEach(clearInterval); };
}
