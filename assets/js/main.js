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
const end=e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>48){set(dx<0?a+1:a-1,false)}setTimeout(()=>moved=false,0)};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',()=>{sx=null})})}
function orbit(){const h=q('.hero');if(!h||h.__o||!('IntersectionObserver' in window))return;h.__o=1;new IntersectionObserver(es=>es.forEach(x=>h.classList.toggle('off',!x.isIntersecting))).observe(h)}
function filters(){qa('[data-filter]').forEach(root=>{if(root.__f)return;root.__f=1;const chips=qa('[data-chip]',root),inp=q('[data-q]',root),items=qa('[data-item]',root),empty=q('[data-empty]',root);let g='all';
const run=()=>{const s=(inp?inp.value:'').trim().toLowerCase();let n=0;items.forEach(it=>{const ok=(g==='all'||it.dataset.g.split(' ').includes(g))&&(!s||it.dataset.t.includes(s));it.hidden=!ok;if(ok)n++});if(empty)empty.hidden=n>0};
chips.forEach(c=>c.onclick=()=>{g=c.dataset.v;chips.forEach(x=>x.setAttribute('aria-pressed',String(x===c)));run()});if(inp)inp.oninput=run;const hs=()=>{const v=(location.hash||'').slice(1);const c=chips.find(x=>x.dataset.v===v);if(c)c.click()};hs();addEventListener('hashchange',hs)})}

// === AWWWARDS LUXURY DUAL-STATE MAGNETIC CURSOR ===
function initLuxuryCursor() {
  if (window.__luxCur || !fine() || reduce()) return;
  window.__luxCur = 1;

  const cur = document.createElement('div');
  cur.className = 'cur-wrap';
  cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<div class="cur-ring"><span class="cur-text"></span></div><div class="cur-dot"></div>';
  document.body.appendChild(cur);

  const ring = cur.querySelector('.cur-ring');
  const dot = cur.querySelector('.cur-dot');
  const textEl = cur.querySelector('.cur-text');

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let magneticEl = null;

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    cur.classList.add('visible');

    // Dot tracks instantly
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    // Check magnetics
    const target = e.target.closest ? e.target.closest('a, button, .btn, .wcard, .sc, .pc-card, .acard, .chipb, input, textarea, summary, [role=tab]') : null;
    if (target) {
      if (target.matches('.btn, .talk, .pc-arrow, .brk-btn, .chipb')) {
        cur.classList.add('cur-magnetic');
        cur.classList.remove('cur-card-hover', 'cur-hover');
        magneticEl = target;
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pullX = (mouseX - centerX) * 0.28;
        const pullY = (mouseY - centerY) * 0.28;
        target.style.transform = `translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0)`;
      } else if (target.matches('.wcard, .sc')) {
        cur.classList.add('cur-card-hover');
        cur.classList.remove('cur-magnetic', 'cur-hover');
        textEl.textContent = 'EXPLORE ↗';
      } else {
        cur.classList.add('cur-hover');
        cur.classList.remove('cur-magnetic', 'cur-card-hover');
      }
    } else {
      cur.classList.remove('cur-magnetic', 'cur-hover', 'cur-card-hover');
      textEl.textContent = '';
      if (magneticEl) {
        magneticEl.style.transform = '';
        magneticEl = null;
      }
    }
  }, { passive: true });

  function loop() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.documentElement.addEventListener('pointerleave', () => {
    cur.classList.remove('visible');
    if (magneticEl) {
      magneticEl.style.transform = '';
      magneticEl = null;
    }
  });
}

// === KINETIC TYPOGRAPHY REVEAL ENGINE ===
function initKineticTypography() {
  if (reduce()) return;
  const headings = qa('.big2, .ph h1, .sh2 h1, .proj-hero h1, .sd-head h2, .pr-head h2, .ar-head h2, .cta-a h2');
  headings.forEach(h => {
    if (h.__splitInit || h.dataset.noSplit) return;
    h.__splitInit = true;

    const rawText = h.textContent.trim();
    h.setAttribute('aria-label', rawText);

    const spans = qa(':scope > span', h);
    if (spans.length > 0) {
      spans.forEach((sp, sIdx) => {
        const words = sp.textContent.trim().split(/\s+/);
        sp.innerHTML = words.map((w, wIdx) => 
          `<span class="k-word-mask"><span class="k-word-inner" style="--w-del:${(sIdx * 0.12 + wIdx * 0.06).toFixed(2)}s">${w}</span></span>`
        ).join(' ');
      });
    } else {
      const words = h.textContent.trim().split(/\s+/);
      h.innerHTML = words.map((w, idx) => 
        `<span class="k-word-mask"><span class="k-word-inner" style="--w-del:${(idx * 0.06).toFixed(2)}s">${w}</span></span>`
      ).join(' ');
    }

    h.classList.add('k-heading');
  });

  if ('IntersectionObserver' in window) {
    const kObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('k-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    qa('.k-heading').forEach(el => kObs.observe(el));
  } else {
    qa('.k-heading').forEach(el => el.classList.add('k-visible'));
  }
}

// === VELOCITY-DRIVEN SCROLL SKEW & INERTIA ===
function initScrollVelocityMotion() {
  if (reduce()) return;
  let lastY = window.scrollY;
  let lastTime = performance.now();
  let velocity = 0;
  let skew = 0;
  let ticking = false;

  const targets = qa('.marquee-track, .hero h1, .wk-top h2, .sv-head h2');

  function update() {
    skew += (velocity * 0.08 - skew) * 0.14;
    const clampedSkew = Math.max(-3.5, Math.min(3.5, skew));

    targets.forEach(t => {
      t.style.setProperty('--scroll-skew', `${clampedSkew.toFixed(2)}deg`);
    });

    velocity *= 0.86;

    if (Math.abs(skew) > 0.02 || Math.abs(velocity) > 0.04) {
      requestAnimationFrame(update);
    } else {
      targets.forEach(t => t.style.removeProperty('--scroll-skew'));
      ticking = false;
    }
  }

  addEventListener('scroll', () => {
    const now = performance.now();
    const dt = Math.max(16, now - lastTime);
    const currY = window.scrollY;
    velocity = (currY - lastY) / (dt * 0.06);
    lastY = currY;
    lastTime = now;

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
}

// === ATMOSPHERIC MULTI-LAYER PARALLAX ===
function initParallaxEngine() {
  if (reduce() || matchMedia('(max-width: 768px)').matches) return;
  const parallaxItems = qa('[data-parallax], .sector-badge, .agency-avail, .wc-stat, .pc-pill, .orbit');

  let ticking = false;
  function updateParallax() {
    const vh = window.innerHeight;
    parallaxItems.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom >= -100 && rect.top <= vh + 100) {
        const centerOffset = (rect.top + rect.height / 2) - (vh / 2);
        const factor = parseFloat(el.dataset.parallax || (el.classList.contains('orbit') ? 0.08 : 0.04));
        const py = centerOffset * factor * -1;
        el.style.setProperty('--py', `${py.toFixed(1)}px`);
      }
    });
    ticking = false;
  }

  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
}

// === INTERACTIVE WORD HOVER IN HEADINGS ===
function initInteractiveWordHover() {
  if (reduce() || matchMedia('(pointer: coarse)').matches) return;
  qa('.k-word-inner').forEach(word => {
    word.addEventListener('mouseenter', () => {
      word.classList.add('word-hover');
      setTimeout(() => word.classList.remove('word-hover'), 600);
    });
  });
}

function enquiry(){const f=q('#enq');if(!f||f.__e)return;f.__e=1;const sets=qa('fieldset[data-step]',f),stp=qa('.stepper li:not(.ln2)',f.closest('.cs-form')||document),lns=qa('.stepper .ln2',f.closest('.cs-form')||document),box=q('#enq-msg');let cur=0;
const show=i=>{cur=i;sets.forEach((s,k)=>s.hidden=k!==i);stp.forEach((l,k)=>{l.classList.toggle('on',k===i);l.classList.toggle('done',k<i)});lns.forEach((l,k)=>l.classList.toggle('done',k<i));const fi=q('input,select,textarea',sets[i]);if(fi&&i>0)fi.focus()};
const err=(el,m)=>{const e=el.closest('div').querySelector('.err');if(e)e.textContent=m||'';el.setAttribute('aria-invalid',m?'true':'false')};
const check=s=>{let ok=true;qa('input,select,textarea',s).forEach(el=>{if(el.name==='website')return;err(el,'');if(!el.checkValidity()){err(el,el.validationMessage||'Please check this field.');if(ok)el.focus();ok=false}});return ok};
if(f.dataset.preview){}
f.classList.add('stepped');show(0);qa('[data-next]',f).forEach(b=>b.onclick=()=>{if(check(sets[cur]))show(cur+1)});qa('[data-back]',f).forEach(b=>b.onclick=()=>show(cur-1));
const note=(h,t)=>{box.hidden=false;box.innerHTML='<h3></h3><p></p>';box.querySelector('h3').textContent=h;box.querySelector('p').textContent=t};
f.addEventListener('submit',async e=>{e.preventDefault();if(!check(sets[cur]))return;
if(window.__PREVIEW){note('Preview only','This is the front-end preview. The running website saves enquiries in its database; nothing was saved or sent from here.');return}
const btn=q('[type=submit]',f);btn.disabled=true;btn.textContent='Sending…';
try{const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}});let j={};try{j=await r.json()}catch(_){}
if(r.ok&&j.ok){f.hidden=true;qa('.stepper',f.closest('.cs-form')).forEach(x=>x.hidden=true);note('Thank you. Your enquiry has been saved.','We have it and will reply by email or WhatsApp. You can also message us directly on WhatsApp or by email.');box.focus()}
else{btn.disabled=false;btn.textContent='Send enquiry';const es=j.errors||{};let first=-1;Object.keys(es).forEach(k=>{const el=f.elements[k==='biz'?'biz':k];if(el){err(el,es[k]);const si=sets.findIndex(s=>s.contains(el));if(si>=0&&(first<0||si<first))first=si}});if(first>=0)show(first);note(r.status===429?'Please try again later':'Please check the highlighted fields',es.form||'Some details need a change before we can save your enquiry. Nothing was lost; you can also use WhatsApp or email.')}}
catch(_){btn.disabled=false;btn.textContent='Send enquiry';note('Not saved','The enquiry could not be sent because the connection failed. Please try again, or use WhatsApp or email below.')}})}

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

function init(){initHeroPortal();init3DCardTilt();R.classList.add('js');hdr();prog();reveal();menu();svtabs();carousel();orbit();filters();cursor();initLuxuryCursor();initKineticTypography();initScrollVelocityMotion();initParallaxEngine();initInteractiveWordHover();enquiry();const h=q('header');if(h&&'ResizeObserver' in window){if(window.__ro)window.__ro.disconnect();window.__ro=new ResizeObserver(hdr);window.__ro.observe(h)}}
if(!window.__dms){window.__dms=1;let tk=0;addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(()=>{hdr();prog();tk=0})}},{passive:true});addEventListener('resize',hdr);
document.addEventListener('click',e=>{if(e.target.closest('button,a,.wcard,.btn'))AudioFX.click();const b=e.target.closest('[data-confirm]');if(b&&!confirm(b.dataset.confirm))e.preventDefault()})}
window.dmsInit=init;init()})();
window.__PREVIEW=true;