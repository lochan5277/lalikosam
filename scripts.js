const photos = [
  // Auto-populated photo paths (from workspace Photos folder)
  "../Photos/ANIL7159.JPG",
  "../Photos/ANIL7162.JPG",
  "../Photos/ANIL7163.JPG",
  "../Photos/ANIL7164.JPG",
  "../Photos/ANIL7166.JPG",
  "../Photos/ANIL7171.JPG",
  "../Photos/ANIL7173.JPG",
  "../Photos/ANIL8575.JPG",
  "../Photos/ANIL8578.JPG",
  "../Photos/ANIL8580.JPG",
  "../Photos/ANIL8581.JPG",
  "../Photos/ANIL8583.JPG",
  "../Photos/ANIL8585.JPG",
  "../Photos/ANIL8586.JPG",
  "../Photos/ANIL8587.JPG",
  "../Photos/ANIL8589.JPG",
  "../Photos/ANIL8590.JPG",
  "../Photos/ANIL8592.JPG",
  "../Photos/ANIL8594.JPG",
  "../Photos/IMG_20241109_082518.jpg",
  "../Photos/IMG_20241109_082553.jpg",
  "../Photos/IMG_20241207_172815.jpg",
  "../Photos/IMG_20250130_200859.jpg",
  "../Photos/IMG_20250809_184727.jpg",
  "../Photos/IMG_20250809_191438.jpg",
  "../Photos/IMG_20250809_202848.jpg",
  "../Photos/IMG_2891.jpg",
  "../Photos/IMG_20241231_211919.jpg",
  "../Photos/IMG_20250130_200845.jpg",
  "../Photos/IMG-20241005-WA0014.jpg",
  "../Photos/IMG-20241031-WA0001.jpg",
  "../Photos/IMG-20241031-WA0002.jpg",
  "../Photos/IMG-20241031-WA0003.jpg",
  "../Photos/IMG-20241031-WA0004.jpg",
  "../Photos/IMG-20241031-WA0005.jpg",
  "../Photos/IMG-20241123-WA0013.jpg",
  "../Photos/IMG-20250101-WA0041.jpg",
  "../Photos/IMG-20250101-WA0127.jpg",
  "../Photos/IMG-20250114-WA0012.jpg",
  "../Photos/IMG-20250114-WA0014.jpg",
  "../Photos/IMG-20250114-WA0016.jpg",
  "../Photos/IMG-20250607-WA0034.jpg",
  "../Photos/IMG-20250608-WA0017.jpg",
  "../Photos/IMG-20250609-WA0083.jpg",
  "../Photos/IMG-20250907-WA0060.jpg",
  "../Photos/IMG-20250907-WA0087.jpg",
  "../Photos/IMG-20250907-WA0089.jpg",
  "../Photos/IMG-20250909-WA0024.jpg",
  "../Photos/IMG-20250909-WA0025.jpg",
  "../Photos/Snapchat-1248837628.jpg",
  "../Photos/IMG-20250831-WA0026.jpg"
];

// Slideshow on index page
function initSlideshow(){
  // register only the 7 specified slides for the modal slideshow
  const slides = [
    "../Photos/IMG_20241109_082518.jpg",
    "../Photos/IMG_2891.jpg",
    "../Photos/IMG_20241207_172815.jpg",
    "../Photos/IMG_20250130_200859.jpg",
    "../Photos/IMG-20250609-WA0083.jpg",
    "../Photos/IMG_20250809_184727.jpg",
    "../Photos/IMG-20250907-WA0089.jpg",
    "../Photos/IMG_20241109_082553.jpg",
    "../Photos/IMG-20250607-WA0034.jpg",
    "../Photos/IMG_20250809_191438.jpg"
  ];
  window._modalSlides = slides;
  // preload the second slide to avoid a flash when opening
  if(slides.length > 1){ const pimg = new Image(); pimg.src = slides[1]; }
}

// Modal slideshow (opens when user clicks "View Slides")
function openSlideshowModal(startIndex = 0){
  const slides = (window._modalSlides && window._modalSlides.length) ? window._modalSlides : photos.slice();
  if(!slides.length){
    // no slides available — show a minimal modal message
    const msgModal = document.createElement('div'); msgModal.className = 'modal slideshow-modal';
    msgModal.innerHTML = `<div class="lightbox"><button class="lightbox-close" aria-label="Close">×</button><div class="slide-stage">No slides available</div></div>`;
    document.body.appendChild(msgModal);
    msgModal.querySelector('.lightbox-close').addEventListener('click',()=>msgModal.remove());
    msgModal.addEventListener('click',(e)=>{ if(e.target === msgModal) msgModal.remove(); });
    return;
  }
  let idx = Math.max(0, Math.min(startIndex, slides.length-1));
  const existing = document.querySelector('.modal.slideshow-modal');
  if(existing) existing.remove();
  const modal = document.createElement('div'); modal.className = 'modal slideshow-modal';
  modal.innerHTML = `
    <div class="lightbox">
      <button class="lightbox-close" aria-label="Close">×</button>
      <div class="slide-stage" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(modal);

  const stage = modal.querySelector('.slide-stage');
  // render with a fade-in and preload next image
  function render(){
    stage.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'lightbox-img slide-img';
    img.src = slides[idx];
    img.alt = `slide-${idx}`;
    img.loading = 'eager';
    img.decoding = 'async';
    stage.appendChild(img);
    // trigger fade in on next frame
    requestAnimationFrame(()=> img.classList.add('show'));
    // preload next
    const next = new Image(); next.src = slides[(idx+1)%slides.length];
  }
  render();

  function showPrev(){ idx = (idx-1+slides.length)%slides.length; render(); }
  function showNext(){ idx = (idx+1)%slides.length; render(); }

  // autoplay controls
  let autoplayId = null;
  const AUTOPLAY_MS = 1250;
  function startAutoplay(){ stopAutoplay(); autoplayId = setInterval(()=>{ showNext(); }, AUTOPLAY_MS); }
  function stopAutoplay(){ if(autoplayId){ clearInterval(autoplayId); autoplayId = null; } }

  // pause on hover
  stage.addEventListener('mouseenter', ()=> stopAutoplay());
  stage.addEventListener('mouseleave', ()=> startAutoplay());

  // prev/next buttons removed for a cleaner slideshow UI; keyboard arrows still work
  modal.querySelector('.lightbox-close').addEventListener('click', (e)=>{ e.stopPropagation(); cleanup(); });
  modal.addEventListener('click',(e)=>{ if(e.target === modal) cleanup(); });

  function onKey(e){ if(e.key==='ArrowLeft') showPrev(); if(e.key==='ArrowRight') showNext(); if(e.key==='Escape') cleanup(); }
  document.addEventListener('keydown', onKey);

  function cleanup(){
    // stop autoplay, remove key handlers and remove modal
    stopAutoplay();
    try{ document.removeEventListener('keydown', onKey); }catch(_){ }
    if(modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  // ensure cleanup also runs if someone removes the modal element directly
  modal.addEventListener('remove', ()=>{ stopAutoplay(); try{ document.removeEventListener('keydown', onKey); }catch(_){ } });

  // start autoplay when modal opens
  startAutoplay();
}

// wire view slides button when DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('view-slides-btn');
  if(btn) btn.addEventListener('click', (e)=>{ e.preventDefault(); openSlideshowModal(0); });
});

// Background music initializer (no-op if not used)
function initMusic(){
  // intentionally minimal: if you add an audio control with id 'music-btn' we'll wire it up
  try{ const btn = document.getElementById('music-btn'); if(!btn) return; }catch(e){}
}

// Easter egg
function initEaster(){
  const e = document.getElementById('easter');
  if(!e) return;
  // make sure Enter/Space activate link for keyboard users
  e.addEventListener('keydown',(ev)=>{
    if(ev.key === 'Enter' || ev.key === ' '){
      e.click();
    }
  });
}

// Gallery page init
let galleryOrder = [];
let currentModalIndex = -1;
function initGallery(){
  const grid = document.querySelector('.gallery-grid');
  console.debug('initGallery: grid found?', !!grid);
  if(!grid) return;
  // clear any previous content and shuffle photos
  grid.innerHTML = '';
  const shuffled = photos.slice().sort(()=>Math.random()-0.5);
  galleryOrder = shuffled;
  shuffled.forEach((p,i)=>{
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = p;
    img.alt = 'Chickoo memory';
    img.dataset.index = i;
    img.style.display = 'block';
    // onerror fallback: if HEIC, try same name with .jpg; otherwise show inline SVG placeholder
    img.onerror = function(){
      try{
        if(this._tried){
          const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">'
            + '<rect width="100%" height="100%" fill="%23fdeff6"/>'
            + '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23766" font-size="20">Image not available</text>'
            + '</svg>';
          this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
          return;
        }
        this._tried = true;
        if(/\.heic$/i.test(this.src)){
          this.src = this.src.replace(/\.heic$/i,'.jpg');
          return;
        }
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">'
          + '<rect width="100%" height="100%" fill="%23fdeff6"/>'
          + '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23766" font-size="20">Image not available</text>'
          + '</svg>';
        this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      }catch(e){
        this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23fdeff6"/></svg>');
      }
    };
    img.addEventListener('click',(ev)=>{
      const idx = Number(ev.currentTarget.dataset.index);
      openModal(idx);
    });
    grid.appendChild(img);
  });
  console.debug('initGallery: appended', grid.querySelectorAll('img').length, 'images');
  // if nothing appended, show a helpful message for debugging
  if(!grid.querySelectorAll('img').length){
    const note = document.createElement('div');
    note.className = 'gallery-empty';
    note.textContent = 'No images found — check image paths or the Photos folder.';
    grid.appendChild(note);
  }
}

function showModalImageByIndex(idx){
  if(!galleryOrder.length) return;
  if(idx < 0) idx = galleryOrder.length - 1;
  if(idx >= galleryOrder.length) idx = 0;
  currentModalIndex = idx;
  const src = galleryOrder[currentModalIndex];
  const existing = document.querySelector('.modal');
  if(existing) existing.remove();
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="lightbox">
      <button class="lightbox-close" aria-label="Close">×</button>
      <button class="lightbox-prev" aria-label="Previous">‹</button>
      <img class="lightbox-img" src="${src}" alt="photo" />
      <button class="lightbox-next" aria-label="Next">›</button>
    </div>
  `;
  // close when clicking background only
  modal.addEventListener('click',(e)=>{ if(e.target === modal) modal.remove(); });
  document.body.appendChild(modal);

  const imgEl = modal.querySelector('.lightbox-img');
  const prevBtn = modal.querySelector('.lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next');
  const closeBtn = modal.querySelector('.lightbox-close');

  // attach same fallback logic to modal image
  imgEl.onerror = function(){
    try{
      if(this._tried){
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">'
          + '<rect width="100%" height="100%" fill="%23fdeff6"/>'
          + '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23766" font-size="24">Image not available</text>'
          + '</svg>';
        this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        return;
      }
      this._tried = true;
      if(/\.heic$/i.test(this.src)){
        this.src = this.src.replace(/\.heic$/i,'.jpg');
        return;
      }
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">'
        + '<rect width="100%" height="100%" fill="%23fdeff6"/>'
        + '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23766" font-size="24">Image not available</text>'
        + '</svg>';
      this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }catch(e){
      this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23fdeff6"/></svg>');
    }
  };

  function showPrev(){ cleanupAndRemove(); showModalImageByIndex(currentModalIndex - 1); }
  function showNext(){ cleanupAndRemove(); showModalImageByIndex(currentModalIndex + 1); }

  prevBtn.addEventListener('click',(e)=>{ e.stopPropagation(); showPrev(); });
  nextBtn.addEventListener('click',(e)=>{ e.stopPropagation(); showNext(); });
  closeBtn.addEventListener('click',(e)=>{ e.stopPropagation(); cleanupAndRemove(); });

  // keyboard navigation
  function onKey(e){
    if(e.key === 'ArrowLeft') showPrev();
    if(e.key === 'ArrowRight') showNext();
    if(e.key === 'Escape'){
      cleanupAndRemove();
    }
  }
  document.addEventListener('keydown', onKey, {once:false});

  // helper to clean up listeners and remove modal
  function cleanupAndRemove(){
    try{ document.removeEventListener('keydown', onKey); }catch(_){}
    if(modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  // close when clicking background only (use cleanup)
  modal.addEventListener('click',(e)=>{ if(e.target === modal) cleanupAndRemove(); });
}

function openModal(indexOrSrc){
  // prefer index variant
  if(typeof indexOrSrc === 'number'){
    showModalImageByIndex(indexOrSrc);
    return;
  }
  // fallback: try find index
  const idx = galleryOrder.indexOf(indexOrSrc);
  if(idx >= 0) showModalImageByIndex(idx);
  else {
    // show as single image
    galleryOrder = [indexOrSrc];
    showModalImageByIndex(0);
  }
}
 
  // Confetti
  function launchConfetti(){
    const container = document.createElement('div');
    container.className='confetti';
    for(let i=0;i<40;i++){
      const c = document.createElement('div');
      c.className='confetti-piece';
      const colors = ['#FDEFF6','#E9E6FF','#D4AF37','#FFFFFF','#FFD1DC'];
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.left = Math.random()*100+'%';
      c.style.top = '-10%';
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      c.style.width = (6+Math.random()*12)+'px';
      c.style.height = (8+Math.random()*16)+'px';
      container.appendChild(c);
      const fall = c.animate([{transform:'translateY(0) rotate(0deg)'},{transform:`translateY(${window.innerHeight+200}px) rotate(${360+Math.random()*360}deg)`}],{duration:3000+Math.random()*3000,delay:Math.random()*400});
      fall.onfinish = ()=>c.remove();
    }
    document.body.appendChild(container);
    setTimeout(()=>container.remove(),7000);
  }

  // sparkle injection for princess frame
  function injectSparkles(){
    const frames = document.querySelectorAll('.frame');
    frames.forEach(f=>{
      const s = document.createElement('div');
      s.className='sparkles';
      for(let i=0;i<6;i++){const sp=document.createElement('span');s.appendChild(sp)}
      f.appendChild(s);
    });
  }

// Wishes page
function initWishes(){
  const form = document.getElementById('wish-form');
  const list = document.getElementById('wishes-list');
  if(!form || !list) return;
  const saved = JSON.parse(localStorage.getItem('wishes')||'[]');
  saved.forEach(w=>addWishToDOM(w.name,w.text));
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value || 'Anonymous';
    const text = form.querySelector('[name="message"]').value || '';
    const wish = {name,text,ts:Date.now()};
    saved.push(wish);
    localStorage.setItem('wishes',JSON.stringify(saved));
    addWishToDOM(name,text,true);
    form.reset();
  });
}

function addWishToDOM(name,text,animate=false){
  const list = document.getElementById('wishes-list');
  if(!list) return;
  const item = document.createElement('div');
  item.className='wish-item';
  item.innerHTML = `<strong>${escapeHtml(name)}</strong><p>${escapeHtml(text)}</p>`;
  list.prepend(item);
  if(animate) floatWish(item);
}

function floatWish(el){
  el.style.position='fixed';el.style.left=(20+Math.random()*60)+'%';el.style.bottom='-50px';el.style.background='rgba(255,255,255,.9)';el.style.padding='8px 12px';el.style.borderRadius='20px';el.style.boxShadow='0 12px 30px rgba(0,0,0,.12)';
  document.body.appendChild(el);
  const top = window.innerHeight*0.2 + Math.random()*200;
  el.animate([{transform:'translateY(0)'},{transform:`translateY(-${top}px)`}],{duration:4000,easing:'ease-out'}).onfinish=()=>el.remove();
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}

// Initialize helpers on DOMContentLoaded
document.addEventListener('DOMContentLoaded',()=>{initSlideshow();initMusic();initEaster();initGallery();initWishes();});

// Special wish display (word-by-word)
function initSpecialWish(){

  const container = document.getElementById('special-wish');
  const replay = document.getElementById('replay-wish');
  if(!container) return;
  const text = `Tonight the world shines, is a bit kinder and far more beautiful. Because it’s the date you made your way into this world. ‘𝗦𝘄𝗲𝗲𝘁𝗲𝘀𝘁 𝗯𝗹𝗲𝘀𝘀𝗶𝗻𝗴 𝗠𝘆 𝗟𝗮𝗹𝗶 𝗣𝗶𝗹𝗶.’ 🌷

On this special day, we just want to give you the heads up — we love you lots. We love you from the 𝗱𝗲𝗲𝗽𝗲𝘀𝘁 𝗽𝗮𝗿𝘁 𝗼𝗳 𝗼𝘂𝗿 𝘀𝗼𝘂𝗹 — with every beat of our heart and in every prayer we whispered for your happiness. You’ve touched our hearts in ways no other could and we are 𝗴𝗿𝗮𝘁𝗲𝗳𝘂𝗹 for that forever. 🌺

You are a 𝗣𝗿𝗶𝗻𝗰𝗲𝘀𝘀, you have so much class and grace as well as 𝘀𝘁𝗿𝗲𝗻𝗴𝘁𝗵. You don’t rule with might, you rule in our hearts by 𝗹𝗼𝘃𝗲. That you sport your crown of compassion so easily that everyone who knows you can feel its 𝗿𝗮𝗱𝗶𝗮𝗻𝗰𝗲. 👑

And you are also the 𝗗𝗶𝘃𝗶𝗻𝗲 𝗘𝗻𝗲𝗿𝗴𝘆, in female form — 𝗲𝗹𝗲𝗴𝗮𝗻𝘁, 𝗶𝗻𝘁𝗲𝗹𝗹𝗶𝗴𝗲𝗻𝘁 𝗮𝗻𝗱 𝗿𝗮𝗱𝗶𝗮𝗻𝘁. Your presence is calming, your words encouraging and inspiring and your spirit radiates the power of million suns. Every day, you teach us that no matter what we look like, 𝗯𝗲𝗮𝘂𝘁𝘆 𝗰𝗼𝗺𝗲𝘀 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝘀𝗼𝘂𝗹 𝗮𝗻𝗱 𝘁𝗵𝗮𝘁’𝘀 𝘄𝗵𝗲𝗿𝗲 𝘁𝗿𝘂𝗲 𝗽𝗼𝘄𝗲𝗿 𝗿𝗲𝘀𝗶𝗱𝗲𝘀. ✨🌸

Now that you are beginning another year of your journey, may the sun rise each day to 𝗹𝗶𝗴𝗵𝘁 𝘂𝗽 for your new blessings, may the stars appear every night to 𝗲𝗺𝗯𝗿𝗮𝗰𝗲 you with comfort and remind you that even in your darkest times even they also flourish. 𝗞𝗲𝗲𝗽 𝗰𝗵𝗮𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗱𝗿𝗲𝗮𝗺𝘀, 𝘀𝗽𝗿𝗲𝗮𝗱 𝘆𝗼𝘂𝗿 𝗹𝗶𝗴𝗵𝘁 𝗮𝗻𝗱 𝗹𝗼𝘃𝗲 𝗮𝘀 𝘆𝗼𝘂 𝗮𝗹𝘄𝗮𝘆𝘀 𝗵𝗮𝘃𝗲 𝗮𝗻𝗱 𝘀𝗽𝗿𝗲𝗮𝗱 𝘁𝗵𝗲 𝘀𝗮𝗺𝗲 𝗷𝗼𝘆 𝘆𝗼𝘂’𝘃𝗲 𝘀𝗵𝗼𝘄𝗻 𝗮𝗹𝗹 𝗼𝗳 𝘂𝘀!

𝗛𝗮𝗽𝗽𝘆 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗖𝗵𝗶𝗰𝗸𝗼𝗼! 🎂💖
You’re not just my sister — you’re my miracle, forever blessing! May magic, laughter, and a whole lot of love go down your road. 🌈💫`;

  // timers to allow cancellation when replaying
  let timers = [];
  function clearTimers(){
    timers.forEach(id=>clearTimeout(id));
    timers = [];
  }

  function displayWordByWord(){
    clearTimers();
    container.innerHTML = '';
    // split into paragraphs, preserve paragraph breaks
    const paragraphs = text.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
    // build paragraph elements with word spans
    paragraphs.forEach(para=>{
      const p = document.createElement('p');
      p.className = 'wish-para';
      const words = para.split(/\s+/);
      words.forEach((w,idx)=>{
        const span = document.createElement('span');
        span.className='word';
        span.textContent = w;
        p.appendChild(span);
        if(idx < words.length - 1) p.appendChild(document.createTextNode(' '));
      });
      container.appendChild(p);
    });

    const spans = Array.from(container.querySelectorAll('.word'));
    let i = 0;
    function step(){
      if(i >= spans.length) return;
      const span = spans[i++];
      // reveal
      requestAnimationFrame(()=>span.classList.add('show'));
      const len = span.textContent.trim().length;
      const delay = len>30 ? 650 : len>8 ? 260 : 120;
      const id = setTimeout(step, delay);
      timers.push(id);
    }
    step();
  }

  displayWordByWord();
  if(replay){
    replay.addEventListener('click',()=>{
      // scroll to top of document so the wish start is visible
      try{window.scrollTo({top:0,behavior:'smooth'});}catch(e){window.scrollTo(0,0);}
      // give the smooth scroll a moment, then replay
      setTimeout(()=>{
        displayWordByWord();
        container.focus({preventScroll:true});
      },350);
      replay.focus();
    });
  }
}

// initialize special wish on DOM ready
document.addEventListener('DOMContentLoaded',()=>{initSpecialWish();});
