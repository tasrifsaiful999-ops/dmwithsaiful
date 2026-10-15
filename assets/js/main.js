(function(){const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)],R=document.documentElement;
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches,fine=()=>matchMedia('(pointer: fine)').matches;
function hdr(){const h=q('header');if(!h)return;h.classList.toggle('scrolled',(window.scrollY||R.scrollTop)>8);R.style.setProperty('--hh',h.offsetHeight+'px')}
function prog(){const r=q('.rp i');if(!r)return;const mx=R.scrollHeight-R.clientHeight;r.style.transform='scaleX('+(mx>0?Math.min(1,(window.scrollY||R.scrollTop)/mx):0)+')'}
function reveal(){qa('.stg').forEach(g=>[...g.children].forEach((c,i)=>{c.classList.add('rv');c.style.setProperty('--d',Math.min(i,5)*80+'ms')}));
if(!('IntersectionObserver' in window)||reduce())return;
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.1,rootMargin:'0px 0px -6% 0px'});
qa('.rv').forEach(e=>{if(e.classList.contains('in')||e.classList.contains('pre'))return;const r=e.getBoundingClientRect();if(r.top<innerHeight*.94&&r.bottom>0){e.classList.add('in')}else{e.classList.add('pre');io.observe(e)}})}
function menu(){const b=q('.menu-btn'),n=q('nav.main');if(!b||!n||b.__m)return;b.__m=1;
const close=f=>{n.classList.remove('open');b.setAttribute('aria-expanded','false');if(f)b.focus()};
b.onclick=()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',String(o))};
n.addEventListener('click',e=>{if(e.target.closest('a'))close(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&n.classList.contains('open'))close(true)});
matchMedia('(min-width: 901px)').addEventListener('change',e=>{if(e.matches)close(false)})}
function svtabs(){qa('[data-svtabs]').forEach(root=>{if(root.__t)return;root.__t=1;const bs=qa('.sv-tabs button',root),ps=qa('.sv-panel',root),id=Math.random().toString(36).slice(2,6);
q('.sv-tabs',root).setAttribute('role','tablist');
bs.forEach((b,i)=>{b.setAttribute('role','tab');b.id='st'+id+i;b.setAttribute('aria-controls','sp'+id+i);ps[i].id='sp'+id+i;ps[i].setAttribute('role','tabpanel');ps[i].setAttribute('aria-labelledby',b.id)});
const set=(n,f)=>{bs.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1;ps[i].classList.toggle('on',i===n)});if(f)bs[n].focus()};
root.classList.add('tabs-on');set(0,false);
bs.forEach((b,i)=>{b.onclick=()=>set(i,false);b.onkeydown=e=>{const k=e.key,n=bs.length;let t=null;if(k==='ArrowRight'||k==='ArrowDown')t=(i+1)%n;if(k==='ArrowLeft'||k==='ArrowUp')t=(i+n-1)%n;if(k==='Home')t=0;if(k==='End')t=n-1;if(t!==null){e.preventDefault();set(t,true)}}})})}
function carousel(){qa('[data-pc]').forEach(root=>{if(root.__c)return;root.__c=1;const cards=qa('.pc-card',root),n=cards.length,stage=q('.pc-stage',root),steps=qa('.pc-steps button',root),live=q('.pc-live',root);let a=0,sx=null,moved=false;
const set=(i,f)=>{a=(i+n)%n;cards.forEach((c,k)=>{const d=(k-a+n)%n;c.dataset.pos=d===0?0:d===1?1:d===n-1?-1:2;c.setAttribute('aria-hidden',String(d!==0));c.tabIndex=d===0?0:-1});steps.forEach((s,k)=>s.setAttribute('aria-current',String(k===a)));if(live)live.textContent='Step '+(a+1)+' of '+n+': '+(q('h3',cards[a]).textContent||'');if(f)stage.focus()};
const layout=()=>{stage.style.height='';cards.forEach(c=>c.style.height='auto');let m=0;cards.forEach(c=>{m=Math.max(m,c.offsetHeight)});cards.forEach(c=>c.style.height=m+'px');stage.style.height=m+'px'};root.classList.add('pc-on');layout();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(layout,120)});stage.tabIndex=0;stage.setAttribute('role','group');stage.setAttribute('aria-roledescription','carousel');stage.setAttribute('aria-label','Process stages');set(0,false);
q('.pc-arrow.prev',root).onclick=()=>set(a-1,false);q('.pc-arrow.next',root).onclick=()=>set(a+1,false);steps.forEach((s,k)=>s.onclick=()=>set(k,false));
cards.forEach((c,k)=>c.addEventListener('click',()=>{if(!moved&&k!==a)set(k,false)}));
stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();set(a+1,false)}if(e.key==='ArrowLeft'){e.preventDefault();set(a-1,false)}});
stage.addEventListener('pointerdown',e=>{sx=e.clientX;moved=false});
stage.addEventListener('pointermove',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>12)moved=true});
const end=e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>48){set(dx<0?a+1:a-1,false)}setTimeout(()=>moved=false,0)};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',()=>{sx=null});
let wheelLock=false,wheelAccum=0;const WHEEL_THRESHOLD=25,WHEEL_COOLDOWN=360;
root.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<6)return;e.preventDefault();if(wheelLock)return;wheelAccum+=e.deltaY;if(wheelAccum>=WHEEL_THRESHOLD){wheelLock=true;wheelAccum=0;set(a+1,false);setTimeout(()=>{wheelLock=false},WHEEL_COOLDOWN)}else if(wheelAccum<=-WHEEL_THRESHOLD){wheelLock=true;wheelAccum=0;set(a-1,false);setTimeout(()=>{wheelLock=false},WHEEL_COOLDOWN)}},{passive:false})})}
function orbit(){const h=q('.hero');if(!h||h.__o||!('IntersectionObserver' in window))return;h.__o=1;new IntersectionObserver(es=>es.forEach(x=>h.classList.toggle('off',!x.isIntersecting))).observe(h)}
function filters(){qa('[data-filter]').forEach(root=>{if(root.__f)return;root.__f=1;const chips=qa('[data-chip]',root),inp=q('[data-q]',root),items=qa('[data-item]',root),empty=q('[data-empty]',root);let g='all';
const run=()=>{const s=(inp?inp.value:'').trim().toLowerCase();let n=0;items.forEach(it=>{const ok=(g==='all'||it.dataset.g.split(' ').includes(g))&&(!s||it.dataset.t.includes(s));it.hidden=!ok;if(ok)n++});if(empty)empty.hidden=n>0};
chips.forEach(c=>c.onclick=()=>{g=c.dataset.v;chips.forEach(x=>x.setAttribute('aria-pressed',String(x===c)));run()});if(inp)inp.oninput=run;const hs=()=>{const v=(location.hash||'').slice(1);const c=chips.find(x=>x.dataset.v===v);if(c)c.click()};hs();addEventListener('hashchange',hs)})}
function cursor(){if(window.__cur||!fine()||reduce())return;window.__cur=1;const c=document.createElement('div');c.className='cur';c.setAttribute('aria-hidden','true');document.body.appendChild(c);let x=0,y=0,tx=0,ty=0,run=0;
const loop=()=>{x+=(tx-x)*.22;y+=(ty-y)*.22;c.style.transform='translate('+x+'px,'+y+'px)';if(Math.abs(tx-x)>.3||Math.abs(ty-y)>.3)requestAnimationFrame(loop);else run=0};
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY;c.classList.add('on');c.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,.btn,input,select,textarea,summary,[role=tab]')));if(!run){run=1;requestAnimationFrame(loop)}},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>c.classList.remove('on'))}
function enquiry(){
  const f = q('#enq');
  if (!f || f.__e) return;
  f.__e = 1;

  const sets = qa('fieldset[data-step]', f);
  const stp = qa('.stepper li:not(.ln2)', f.closest('.cs-form') || document);
  const lns = qa('.stepper .ln2', f.closest('.cs-form') || document);
  const box = q('#enq-msg');
  let cur = 0;

  const show = i => {
    cur = i;
    sets.forEach((s, k) => s.hidden = k !== i);
    stp.forEach((l, k) => {
      l.classList.toggle('on', k === i);
      l.classList.toggle('done', k < i);
    });
    lns.forEach((l, k) => l.classList.toggle('done', k < i));
    const fi = q('input,select,textarea', sets[i]);
    if (fi && i > 0) fi.focus();
  };

  const err = (el, m) => {
    const e = el.closest('div').querySelector('.err');
    if (e) e.textContent = m || '';
    el.setAttribute('aria-invalid', m ? 'true' : 'false');
  };

  const check = s => {
    let ok = true;
    qa('input,select,textarea', s).forEach(el => {
      if (el.name === 'website') return;
      err(el, '');
      if (!el.checkValidity()) {
        err(el, el.validationMessage || 'Please check this field.');
        if (ok) el.focus();
        ok = false;
      }
    });
    return ok;
  };

  f.classList.add('stepped');
  show(0);

  qa('[data-next]', f).forEach(b => b.onclick = () => {
    if (check(sets[cur])) show(cur + 1);
  });

  qa('[data-back]', f).forEach(b => b.onclick = () => show(cur - 1));

  const note = (h, tHtml) => {
    box.hidden = false;
    box.innerHTML = `<h3>${h}</h3><div>${tHtml}</div>`;
    box.focus();
  };

  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (!check(sets[cur])) return;

    const btn = q('[type=submit]', f);
    btn.disabled = true;
    btn.textContent = 'Recording…';

    // Capture submission data
    const leadData = {
      id: 'lead-' + Date.now(),
      name: (f.elements['name'] ? f.elements['name'].value : '').trim(),
      biz: (f.elements['biz'] ? f.elements['biz'].value : '').trim(),
      email: (f.elements['email'] ? f.elements['email'].value : '').trim(),
      phone: (f.elements['phone'] ? f.elements['phone'].value : '').trim(),
      service: (f.elements['service'] ? f.elements['service'].value : '').trim(),
      timeline: (f.elements['timeline'] ? f.elements['timeline'].value : '').trim(),
      budget: (f.elements['budget'] ? f.elements['budget'].value : '').trim(),
      brief: (f.elements['brief'] ? f.elements['brief'].value : '').trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    // Save to localStorage for Owner Admin Dashboard
    try {
      const stored = JSON.parse(localStorage.getItem('dms_enquiries') || '[]');
      stored.unshift(leadData);
      localStorage.setItem('dms_enquiries', JSON.stringify(stored));
    } catch (_) {}

    // Pre-fill WhatsApp message
    const waText = encodeURIComponent(
      `Hello Saiful, I am submitting a project enquiry from dmwithsaiful.com:\n\n` +
      `*Name:* ${leadData.name}\n` +
      `*Business:* ${leadData.biz || 'N/A'}\n` +
      `*Service:* ${leadData.service || 'General'}\n` +
      `*Timeline:* ${leadData.timeline || 'Flexible'}\n` +
      `*Budget:* ${leadData.budget || 'Open'}\n\n` +
      `*Project Brief:*\n${leadData.brief}`
    );
    const waUrl = `https://wa.me/8801533536004?text=${waText}`;

    // Pre-fill direct email message
    const mailSubject = encodeURIComponent(`Project Enquiry: ${leadData.name} — ${leadData.service || 'Growth Project'}`);
    const mailBody = encodeURIComponent(
      `Hello Saiful,\n\nI would like to discuss a digital marketing project with DM with SAIFUL:\n\n` +
      `Name: ${leadData.name}\n` +
      `Business: ${leadData.biz || 'N/A'}\n` +
      `Email: ${leadData.email}\n` +
      `Phone/WhatsApp: ${leadData.phone || 'N/A'}\n` +
      `Service: ${leadData.service || 'General'}\n` +
      `Timeline: ${leadData.timeline || 'Flexible'}\n` +
      `Budget: ${leadData.budget || 'Open'}\n\n` +
      `Project Brief:\n${leadData.brief}\n`
    );
    const mailUrl = `mailto:digitalmarketingwithsaiful@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    // Hide form & steps
    f.hidden = true;
    qa('.stepper', f.closest('.cs-form')).forEach(x => x.hidden = true);

    note(
      'Enquiry Compiled Successfully',
      `<p style="margin:0 0 14px;color:#c4dbd9">Your project brief has been formatted and saved locally on this device.</p>
       <div style="background:rgba(230,161,55,0.08);border:1px solid rgba(230,161,55,0.3);border-radius:8px;padding:14px 16px;margin:0 0 20px">
         <p style="margin:0 0 12px;color:#ffd085;font-size:0.92rem"><b>Direct Dispatch Required:</b> To ensure Saiful receives your brief immediately with zero server lag, please choose your preferred transmission method below:</p>
         <div style="display:flex;gap:12px;flex-wrap:wrap">
           <a class="btn" href="${waUrl}" target="_blank" rel="noopener">Send via WhatsApp (+8801533536004) <span class="arw" aria-hidden="true">→</span></a>
           <a class="btn o" href="${mailUrl}">Send via Email</a>
         </div>
       </div>
       <p style="margin:0 0 16px;font-size:0.8rem;color:#8fb3b0;line-height:1.45"><i>Architecture Disclosure: This website is deployed on a static edge network without a centralized remote server database. Direct dispatch via WhatsApp or Email guarantees immediate receipt by the founder.</i></p>
       <div>
         <a class="btn o" style="font-size:0.85rem;padding:6px 14px" href="/">Return to Home</a>
       </div>`
    );
  });
}

function initHeroPortal() {
  const portal = document.querySelector('.o-portal');
  if (!portal || portal.__portalInit) return;
  portal.__portalInit = true;
  
  const slides = portal.querySelectorAll('.o-slide');
  if (!slides || slides.length === 0) return;
  
  const labelEl = document.getElementById('hero-portal-label');
  const captions = [
    '01 // Meta Ads Scaling Matrix',
    '02 // Anzara Bridal Couture',
    '03 // Azran Menswear Video',
    '04 // Elor Fine Jewellery',
    '05 // Algorithmic SEO Discovery',
    '06 // 4K Studio Production Rig'
  ];
  
  let current = 0;
  let timer = null;
  
  function updateCaption(idx) {
    if (!labelEl) return;
    labelEl.style.opacity = '0';
    labelEl.style.transform = 'translateY(4px)';
    setTimeout(() => {
      labelEl.textContent = captions[idx] || '';
      labelEl.style.opacity = '1';
      labelEl.style.transform = 'translateY(0)';
    }, 180);
  }
  
  function showNext() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
    updateCaption(current);
  }
  
  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(showNext, 2200);
  }
  
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  
  // Unconditional continuous auto-play on page load without requiring mouse
  start();
  updateCaption(0);
  
  portal.addEventListener('mouseenter', stop);
  portal.addEventListener('mouseleave', start);
  portal.addEventListener('click', () => {
    showNext();
    start();
  });
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
}

function init3DCardTilt() {
  if (matchMedia('(pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.wcard, .pc-card, .acard, .sv-panel, .sc');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = x - rect.width / 2;
      const midY = y - rect.height / 2;
      const rotY = (midX / (rect.width / 2)) * 3.8;
      const rotX = (-midY / (rect.height / 2)) * 3.8;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `perspective(1000px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}

const AudioFX = (function() {
  let ctx = null;
  let enabled = false;
  function getCtx() {
    if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  return {
    toggle() {
      enabled = !enabled;
      if (enabled) getCtx();
      return enabled;
    },
    click() {
      if (!enabled) return;
      try {
        const c = getCtx();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.04);
      } catch(_) {}
    }
  };
})();
window.AudioFX = AudioFX;

function init(){initHeroPortal();init3DCardTilt();R.classList.add('js');hdr();prog();reveal();menu();svtabs();carousel();orbit();filters();cursor();enquiry();const h=q('header');if(h&&'ResizeObserver' in window){if(window.__ro)window.__ro.disconnect();window.__ro=new ResizeObserver(hdr);window.__ro.observe(h)}}
if(!window.__dms){window.__dms=1;let tk=0;addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(()=>{hdr();prog();tk=0})}},{passive:true});addEventListener('resize',hdr);
document.addEventListener('click',e=>{if(e.target.closest('button,a,.wcard,.btn'))AudioFX.click();const b=e.target.closest('[data-confirm]');if(b&&!confirm(b.dataset.confirm))e.preventDefault()})}
window.dmsInit=init;init()})();
window.__PREVIEW=true;