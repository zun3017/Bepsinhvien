/* Chỉ tương tác trình bày: biểu đồ, ảnh khi cuộn và phản hồi con trỏ. */
(function () {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  let motionPaused=false;
  const motionOff=()=>motion.matches||motionPaused;

  document.querySelectorAll('[data-donut]').forEach(chart=>{
    const buttons=[...chart.querySelectorAll('[data-ring-part]')];
    const segments=[...chart.querySelectorAll('[data-ring-segment]')];
    let selected=0;
    function show(index,commit=false) {
      if(commit)selected=index;
      const button=buttons[index];
      chart.querySelector('[data-ring-value]').textContent=button.dataset.value;
      chart.querySelector('[data-ring-label]').textContent=button.dataset.label;
      buttons.forEach((item,i)=>{item.classList.toggle('is-active',i===index);item.setAttribute('aria-pressed',String(i===selected));});
      segments.forEach((item,i)=>item.classList.toggle('is-active',i===index));
    }
    buttons.forEach((button,i)=>{
      button.addEventListener('pointerenter',()=>show(i));
      button.addEventListener('focus',()=>show(i));
      button.addEventListener('click',()=>show(i,true));
    });
    segments.forEach((segment,i)=>{
      segment.addEventListener('pointerenter',()=>show(i));
      segment.addEventListener('click',()=>show(i,true));
    });
    chart.addEventListener('pointerleave',()=>show(selected));
    chart.addEventListener('focusout',event=>{if(!chart.contains(event.relatedTarget))show(selected);});
    show(0);
  });

  const revealItems=[...document.querySelectorAll('.hero-copy,.hero-food,.home-section-heading,.day-meal>img,.home-budget,.home-pantry,.premium-copy,.premium-preview,.ring-card,.home-steps li,.story-card,.home-final')];
  document.querySelectorAll('.ring-card,.home-steps li,.story-card,.premium-feature').forEach((item,i)=>item.style.setProperty('--reveal-delay',(i%3)*100+'ms'));
  document.querySelectorAll('.donut-segment').forEach(segment=>{
    const length=Number(segment.getAttribute('stroke-dasharray').split(' ')[0]);
    segment.style.setProperty('--arc-length',length);
    segment.style.setProperty('--arc-gap',100-length);
  });
  let revealObserver;
  const revealAll=()=>revealItems.forEach(item=>item.classList.add('is-revealed'));
  if('IntersectionObserver' in window&&!motion.matches){
    revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target);}});
    },{threshold:.12,rootMargin:'0px 0px -32px 0px'});
    revealItems.forEach(item=>{
      const rect=item.getBoundingClientRect();
      item.classList.add('scroll-reveal');
      if(rect.top<innerHeight*.92&&rect.bottom>0)item.classList.add('is-revealed');
      else revealObserver.observe(item);
    });
  }else revealAll();

  const tilts=[...document.querySelectorAll('.hero-scene,.day-meal,.receipt-visual,.donut-wrap,.nutrition-visual,.premium-chat-preview,.story-card')];
  const glints=[...document.querySelectorAll('.ring-card,.home-budget,.home-pantry,.home-premium,.nutrition-visual,.premium-chat-preview,.premium-feature,.story-card')];
  tilts.forEach(item=>item.classList.add('pointer-tilt'));
  glints.forEach(item=>item.classList.add('pointer-glint'));
  const interactive=[...new Set([...tilts,...glints])];
  const pending=new Map();
  let frame=0;
  function reset(item){pending.delete(item);item.style.removeProperty('--tilt-x');item.style.removeProperty('--tilt-y');item.classList.remove('is-pointer-active');}
  function renderPointer(){
    frame=0;
    pending.forEach(({x,y,width,height},item)=>{
      item.style.setProperty('--pointer-x',x+'px');item.style.setProperty('--pointer-y',y+'px');
      if(item.classList.contains('pointer-tilt')){item.style.setProperty('--tilt-x',((.5-y/height)*3).toFixed(2)+'deg');item.style.setProperty('--tilt-y',((x/width-.5)*4).toFixed(2)+'deg');}
      item.classList.add('is-pointer-active');
    });
    pending.clear();
  }
  interactive.forEach(item=>{
    item.addEventListener('pointermove',event=>{
      if(!finePointer.matches||motionOff()||event.pointerType==='touch')return;
      const rect=item.getBoundingClientRect();
      pending.set(item,{x:event.clientX-rect.left,y:event.clientY-rect.top,width:rect.width,height:rect.height});
      if(!frame)frame=requestAnimationFrame(renderPointer);
    },{passive:true});
    item.addEventListener('pointerleave',()=>reset(item));
    item.addEventListener('pointercancel',()=>reset(item));
  });
  function resetEffects(){interactive.forEach(reset);if(frame)cancelAnimationFrame(frame);frame=0;pending.clear();}
  motion.addEventListener('change',()=>{resetEffects();if(motion.matches){revealObserver?.disconnect();revealAll();}});
  finePointer.addEventListener('change',resetEffects);
  window.addEventListener('blur',resetEffects);

  const preview=document.querySelector('#premium-preview');
  const featureButtons=[...document.querySelectorAll('[data-premium-preview]')];
  if(preview){
    const messages={chat:'Bắt đầu cuộc trò chuyện từ khẩu vị và nguyên liệu của bạn.',receipt:'Từ nguyên liệu đến bữa ăn, trong cùng một không gian.',nutrition:'Khám phá thành phần và cách phối hợp trong món bạn yêu thích.'};
    function selectFeature(mode){
      preview.dataset.preview=mode;
      preview.querySelector('.premium-chat-preview').hidden=mode!=='chat';
      preview.querySelector('.receipt-visual').hidden=mode!=='receipt';
      preview.querySelector('.nutrition-visual').hidden=mode==='chat';
      preview.querySelector('.premium-preview-note').textContent=messages[mode];
      featureButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.premiumPreview===mode)));
      resetEffects();
    }
    featureButtons.forEach(button=>button.addEventListener('click',()=>selectFeature(button.dataset.premiumPreview)));
  }

  // Chuyển động khi cuộn, độc lập với hiệu ứng hover.
  const progress=document.createElement('div');
  progress.className='page-scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const motionButton=document.createElement('button');
  motionButton.type='button';motionButton.className='motion-toggle';document.body.append(motionButton);
  const ambient=[...document.querySelectorAll('.hero-plan,.hero-reuse,.receipt-visual,.nutrition-visual')];
  ambient.forEach(item=>item.classList.add('ambient-motion'));
  if('IntersectionObserver' in window){
    const ambientObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-in-view',entry.isIntersecting)),{threshold:0});
    ambient.forEach(item=>ambientObserver.observe(item));
  }else ambient.forEach(item=>item.classList.add('is-in-view'));
  const images=[...document.querySelectorAll('.hero-food,.day-meal>img')];
  let scrollFrame=0;
  function updateScroll(){
    scrollFrame=0;
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.setProperty('--scroll-progress',max>0?Math.min(1,Math.max(0,scrollY/max)):0);
    images.forEach(image=>{
      const rect=image.getBoundingClientRect();
      if(rect.bottom<0||rect.top>innerHeight)return;
      const shift=motionOff()?0:Math.max(-20,Math.min(20,(innerHeight*.5-rect.top-rect.height*.5)*.055));
      image.style.setProperty('--scroll-parallax',shift.toFixed(2)+'px');
    });
  }
  function requestScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);}
  function syncMotion(){
    const off=motionOff();document.body.classList.toggle('motion-paused',off);
    motionButton.textContent=motion.matches?'Chuyển động đã giảm':off?'Bật chuyển động':'Tạm dừng hiệu ứng';motionButton.setAttribute('aria-pressed',String(off));
    motionButton.disabled=motion.matches;
    motionButton.title=motion.matches?'Đang theo cài đặt giảm chuyển động của thiết bị':'';
    if(off){revealObserver?.disconnect();revealAll();resetEffects();images.forEach(image=>image.style.setProperty('--scroll-parallax','0px'));}
    requestScroll();
  }
  motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;syncMotion();});
  motion.addEventListener('change',syncMotion);
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('motion-hidden',document.hidden));
  window.addEventListener('scroll',requestScroll,{passive:true});
  window.addEventListener('resize',requestScroll);
  syncMotion();
})();
