// @ts-nocheck
// Client-side behaviour for the homepage: name wordmark, Jaipur clock, pharmacy map, copy email.
export function initHome(raEl: HTMLElement): () => void {
  let alive = true;
  const timers: number[] = [];
  const raf = (f) => { if (alive) requestAnimationFrame(f); };

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(raEl).getPropertyValue(n).trim();

  /* ---------- wordmark: each line fills the width; letters respond to the cursor ---------- */
  const lines = [...document.querySelectorAll('[data-fit]')];
  lines.forEach(el => { const t = el.textContent; el.textContent = ''; [...t].forEach(ch => { const s = document.createElement('span'); s.textContent = ch; el.appendChild(s); }); });
  function fit(){ lines.forEach(el => { const box = el.parentElement.getBoundingClientRect().width; el.style.fontSize = '100px';
    const w = el.getBoundingClientRect().width; if (w) el.style.fontSize = (100 * box / w * 0.995) + 'px'; }); }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fit);
  new ResizeObserver(fit).observe(document.querySelector('.name'));
  const nameBox = document.querySelector('.name');
  if (!reduce && matchMedia('(hover: hover)').matches){
    nameBox.addEventListener('pointermove', e => { lines.forEach(el => [...el.children].forEach(s => {
      const r = s.getBoundingClientRect(), d = Math.hypot(e.clientX-(r.left+r.width/2), e.clientY-(r.top+r.height/2)) / r.height;
      const k = Math.exp(-d*d*1.6); s.style.fontVariationSettings = `"wdth" ${125 - 40*k}, "wght" ${800 - 600*k}`; })); });
    nameBox.addEventListener('pointerleave', () => lines.forEach(el => [...el.children].forEach(s => s.style.fontVariationSettings = '')));
  }

  /* ---------- Jaipur clock ---------- */
  const clock = document.getElementById('clock');
  const tick = () => { try { clock.textContent = new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Kolkata'}).format(new Date()) + ' IST'; } catch(e){} };
  tick(); timers.push(setInterval(tick, 20000));

  /* ---------- agent run: map + steps, synced ---------- */
  const steps=[...document.querySelectorAll('#agent li')], reply=document.getElementById('reply'), rp=document.getElementById('replay');
  const mc=document.getElementById('pmap'), mx=mc.getContext('2d');
  const PH=[[.18,.28],[.72,.2],[.62,.76],[.3,.78],[.86,.48],[.1,.6],[.48,.14]], STOCK=[0,2,4], PICK=4, STEP_T=[.3,1.4,2.0,2.8,3.4], END=3.9;
  let MW=0,MH=0, start=-1e9;
  const sz=()=>{ const b=mc.getBoundingClientRect(), d=Math.min(2,devicePixelRatio||1); MW=b.width; MH=b.height; mc.width=MW*d; mc.height=MH*d; mx.setTransform(d,0,0,d,0,0); };
  new ResizeObserver(sz).observe(mc); sz();
  const sg=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))), ez=v=>1-Math.pow(1-v,3);
  function drawMap(now){
    const t=(now-start)/1000, k=Math.min(t,END+1), rani=css('--rani'), indigo=css('--indigo'), mari=css('--marigold'), rule=css('--rule'), mu=css('--muted'), panel=css('--panel'), mono=css('--mono');
    mx.clearRect(0,0,MW,MH); mx.strokeStyle=rule; mx.lineWidth=1;
    for(let i=1;i<6;i++){ const y=MH*i/6+Math.sin(i)*6; mx.beginPath(); mx.moveTo(0,y); mx.lineTo(MW,y+8); mx.stroke(); }
    for(let i=1;i<9;i++){ const x=MW*i/9+Math.cos(i)*8; mx.beginPath(); mx.moveTo(x,0); mx.lineTo(x-10,MH); mx.stroke(); }
    const ux=MW*.45, uy=MH*.52, sc=sg(k,.6,1.6);
    if(sc>0&&sc<1){ mx.globalAlpha=1-sc; mx.strokeStyle=indigo; mx.lineWidth=1.5; mx.beginPath(); mx.arc(ux,uy,sc*MW*.6,0,7); mx.stroke(); mx.globalAlpha=1; }
    const found=ez(sg(k,1.6,2.2)), go=ez(sg(k,2.2,3.0)), conf=ez(sg(k,3.0,3.4));
    const px=MW*PH[PICK][0], py=MH*PH[PICK][1];
    if(go>0){ mx.strokeStyle=rani; mx.lineWidth=2; mx.setLineDash([6,5]); mx.lineDashOffset=-now/40; mx.beginPath(); mx.moveTo(ux,uy); mx.lineTo(ux+(px-ux)*go,uy+(py-uy)*go); mx.stroke(); mx.setLineDash([]); }
    PH.forEach(([fx,fy],i)=>{ const x=MW*fx,y=MH*fy, st=STOCK.includes(i);
      mx.globalAlpha = st ? 1 : 1-found*.55; mx.fillStyle = i===PICK&&conf>0 ? rani : (st&&found>.5 ? indigo : mu);
      mx.fillRect(x-8,y-8,16,16); mx.fillStyle=panel; mx.fillRect(x-1.5,y-5,3,10); mx.fillRect(x-5,y-1.5,10,3); });
    mx.globalAlpha=1; mx.fillStyle=mari; mx.beginPath(); mx.arc(ux,uy,6.5,0,7); mx.fill();
    mx.strokeStyle=mari; mx.globalAlpha=.5; mx.beginPath(); mx.arc(ux,uy,12+Math.sin(now/260)*2.5,0,7); mx.stroke(); mx.globalAlpha=1;
    mx.font=`500 11px ${mono}`; mx.textAlign='center'; mx.fillStyle=mari; mx.fillText('you',ux,uy+26);
    if(conf>0){ const lab='600 m · ready'; const w=mx.measureText(lab).width+16, bx=Math.min(MW-w-8,px-w/2), by=py-34;
      mx.globalAlpha=conf; mx.fillStyle=rani; mx.fillRect(bx,by,w,20); mx.fillStyle=panel; mx.textAlign='left'; mx.fillText(lab,bx+8,by+14); mx.globalAlpha=1; }
    if(t<=END+.5){ steps.forEach((li,i)=>li.classList.toggle('done', t>=STEP_T[i])); reply.style.opacity = t>=END-.2 ? 1 : 0; rp.disabled = t<END; }
  }
  if(reduce){ drawMap(performance.now()); } else { (function ml(now){ drawMap(now); raf(ml); })(performance.now()); }
  rp.addEventListener('click', () => { if(reduce) return; start=performance.now(); });

  /* ---------- copy email ---------- */
  const cp = document.getElementById('copy'), em = document.getElementById('email');
  cp.addEventListener('click', () => { const t = em.textContent;
    const ok = () => { cp.textContent='Copied'; setTimeout(()=>cp.textContent='Copy email',1600); };
    const fb = () => { const r=document.createRange(); r.selectNodeContents(em); const s=getSelection(); s.removeAllRanges(); s.addRange(r); cp.textContent='Selected, press Ctrl+C'; };
    try { navigator.clipboard.writeText(t).then(ok, fb); } catch(e){ fb(); } });

  return () => { alive = false; timers.forEach(clearInterval); };
}
