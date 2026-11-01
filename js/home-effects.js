/* Chỉ tương tác trình bày: biểu đồ, ảnh khi cuộn và phản hồi con trỏ. */
(function () {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');

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

  const revealItems=[...document.querySelectorAll('.hero-food,.day-meal>img,.premium-preview,.ring-card')];
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

  const tilts=[...document.querySelectorAll('.hero-scene,.day-meal,.receipt-visual,.donut-wrap')];
  const glints=[...document.querySelectorAll('.ring-card,.home-budget,.home-pantry')];
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
      if(!finePointer.matches||motion.matches||event.pointerType==='touch')return;
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
})();
