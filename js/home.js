/* Tương tác trang giới thiệu. Không đọc hoặc ghi dữ liệu kế hoạch. */
(function () {
  'use strict';
  document.body.classList.add('js-ready');
  const menu=document.querySelector('#home-nav');
  const toggle=document.querySelector('#home-menu-toggle');
  const closeMenu=()=>{menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Mở menu');};
  toggle.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');});
  menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('is-open')){closeMenu();toggle.focus();}});
  const track=document.querySelector('#story-track');
  const cards=[...track.querySelectorAll('.story-card')];
  const pause=document.querySelector('#story-pause');
  const position=document.querySelector('#story-position');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=motion.matches,timer=null,index=0,hover=false,visible=false,scrollFrame=0;
  document.querySelector('.story-controls').hidden=false;
  function updateControl(){pause.textContent=paused?'Tiếp tục':'Tạm dừng';pause.setAttribute('aria-label',paused?'Tiếp tục tự chuyển tình huống':'Tạm dừng tự chuyển tình huống');}
  function updatePosition(announce=false){
    const bounds=track.getBoundingClientRect();
    const shown=cards.map((card,i)=>({i,b:card.getBoundingClientRect()})).filter(({b})=>Math.min(b.right,bounds.right)-Math.max(b.left,bounds.left)>=b.width*.5).map(({i})=>i);
    const first=shown[0]??0,last=shown.at(-1)??first;
    index=first;
    const text=(first===last?String(first+1):(first+1)+'–'+(last+1))+' / '+cards.length;
    if(position.textContent!==text){position.setAttribute('aria-live',announce?'polite':'off');position.textContent=text;}
  }
  function stopTimer(){clearInterval(timer);timer=null;}
  function schedule(){stopTimer();if(paused||hover||!visible||document.hidden||track.contains(document.activeElement))return;timer=setInterval(()=>move(1,false),6500);}
  function move(delta,manual=true){
    if(manual){paused=true;updateControl();stopTimer();}
    const max=track.scrollWidth-track.clientWidth;
    const targets=[...new Set(cards.map(card=>Math.round(Math.min(card.offsetLeft-cards[0].offsetLeft,max))))];
    const current=targets.reduce((best,left,i)=>Math.abs(left-track.scrollLeft)<Math.abs(targets[best]-track.scrollLeft)?i:best,0);
    const next=(current+delta+targets.length)%targets.length;
    track.scrollTo({left:targets[next],behavior:motion.matches?'instant':'smooth'});
    if(motion.matches)updatePosition(manual);
  }
  pause.addEventListener('click',()=>{paused=!paused;updateControl();schedule();});
  document.querySelector('#story-prev').addEventListener('click',()=>move(-1));
  document.querySelector('#story-next').addEventListener('click',()=>move(1));
  track.addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{const left=track.scrollLeft,max=track.scrollWidth-track.clientWidth;index=left>=max-4&&max>0?cards.length-1:cards.reduce((best,card,i)=>Math.abs(card.offsetLeft-cards[0].offsetLeft-left)<Math.abs(cards[best].offsetLeft-cards[0].offsetLeft-left)?i:best,0);updatePosition(false);});},{passive:true});
  track.addEventListener('pointerdown',()=>{paused=true;updateControl();stopTimer();},{passive:true});
  track.addEventListener('wheel',()=>{paused=true;updateControl();stopTimer();},{passive:true});
  track.addEventListener('keydown',event=>{if(event.target===track&&(event.key==='ArrowRight'||event.key==='ArrowLeft')){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
  track.addEventListener('focusin',()=>{paused=true;updateControl();stopTimer();});
  track.addEventListener('mouseenter',()=>{hover=true;stopTimer();});
  track.addEventListener('mouseleave',()=>{hover=false;schedule();});
  track.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open){paused=true;updateControl();stopTimer();}}));
  document.addEventListener('visibilitychange',schedule);
  motion.addEventListener('change',()=>{if(motion.matches)paused=true;updateControl();schedule();});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25});observer.observe(track);}else{visible=true;schedule();}
  window.addEventListener('pagehide',stopTimer);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('resize',()=>updatePosition(false));
  updateControl();updatePosition();
})();
