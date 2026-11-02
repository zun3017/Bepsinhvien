(function(){
  'use strict';
  const A=window.UI,D=window.Demo,{esc,icon,money,qty}=A;
  let currentDay=1;
  let active=0,query='',stockOnly=false,categoryFilter='all',isAddingMode=false,replaceTargetDishId=null;

  function getMealLabels(meals){
    if(meals===4) return ['Bữa sáng','Bữa trưa','Bữa xế','Bữa tối'];
    if(meals===2) return ['Bữa trưa','Bữa tối'];
    return ['Bữa sáng','Bữa trưa','Bữa tối'];
  }

  function getMealLabel(s,idx){
    const list=getMealLabels(s.meals);
    return list[idx] || `Bữa ${idx+1}`;
  }

  const off=s=>s.checkedOut?'disabled':'';
  const ingredientList=items=>items.map(i=>`${esc((D.ingredients[i.key]&&D.ingredients[i.key].name)||i.key)} ${qty(i.qty,((D.ingredients[i.key]&&D.ingredients[i.key].unit)||'g'))}`).join(' · ');
  const image=d=>`<img src="assets/images/${d.image}" alt="Ảnh bữa ăn minh họa" loading="lazy">`;

  function availabilityBadge(s,d){
    const m=D.stockMatch(s,d);
    if(m.have.length>0 && m.missing.length===0){
      return `<div class="dish-stock-badge in-stock">${icon('check')} <span>Tủ lạnh có đủ nguyên liệu</span></div>`;
    }
    if(m.have.length>0 && m.missing.length>0){
      return `<div class="dish-stock-badge partial-stock">${icon('fridge')} <span>Có sẵn: ${ingredientList(m.have)} · Mua thêm: ${ingredientList(m.missing)}</span></div>`;
    }
    return `<div class="dish-stock-badge need-buy">${icon('cart')} <span>Cần mua thêm nguyên liệu</span></div>`;
  }

  function results(labels){
    const s=A.state;
    let pool=D.candidates(s,active,query,stockOnly,currentDay,true);
    if(categoryFilter!=='all'){
      pool=pool.filter(d=>(d.category||'mặn')===categoryFilter || (categoryFilter==='canh'&&d.meal==='Món phụ'));
    }
    const label=labels[active]||'bữa ăn';
    const dayDishes=D.getDayMealDishes(s,currentDay,active);
    const dayDishIds=dayDishes.map(d=>d.id);

    return `
      <div class="catalog-header-bar">
        <p class="catalog-count" role="status">
          <strong>${pool.length} món phù hợp</strong> cho ${label.toLowerCase()} · Đã ưu tiên tủ lạnh & xoay tua nguyên liệu
        </p>
        <div class="category-filters">
          ${[['all','Tất cả'],['mặn','Món mặn'],['canh','Món canh'],['rau','Món rau'],['chính','Bữa sáng/nhẹ']].map(([id,name])=>`
            <button type="button" class="cat-pill ${categoryFilter===id?'active':''}" data-cat="${id}">${name}</button>
          `).join('')}
        </div>
      </div>
      ${pool.length?`<div class="dish-catalog">${pool.map(d=>{
        const alreadyInMeal=dayDishIds.includes(d.id);
        return `
          <article class="catalog-dish ${alreadyInMeal?'already-added':''}">
            ${image(d)}
            <div class="catalog-dish-info">
              <div class="row between">
                <h3>${esc(d.name)}</h3>
                <strong class="dish-price number">${money(d.cost)}</strong>
              </div>
              <p class="dish-meta"><span>⏱ ${d.time} phút</span> · <span class="tag-cat">${d.category==='canh'?'Món canh':d.category==='rau'?'Món rau':'Món chính'}</span></p>
              ${availabilityBadge(s,d)}
              <div class="actions">
                ${isAddingMode ? `
                  <button class="btn small primary" data-add-to-meal="${d.id}" ${off(s)} ${alreadyInMeal?'disabled':''}>
                    ${alreadyInMeal ? icon('check')+' Đã có trong bữa' : icon('plus')+' Thêm vào '+label.toLowerCase()}
                  </button>
                ` : `
                  <button class="btn small ${alreadyInMeal?'':'primary'}" data-pick-dish="${d.id}" ${off(s)}>
                    ${alreadyInMeal ? icon('check')+' Đang chọn' : 'Đổi thành món này'}
                  </button>
                  <button class="btn small" data-add-to-meal="${d.id}" ${off(s)} ${alreadyInMeal?'disabled':''}>
                    ${icon('plus')} Thêm món này
                  </button>
                `}
                <button class="text-btn small" data-recipe="${d.id}">Cách nấu</button>
              </div>
            </div>
          </article>
        `;
      }).join('')}</div>`:`<div class="catalog-empty">${icon('utensils')}<h3>Chưa tìm thấy món phù hợp</h3><p>Thử tên món khác hoặc chuyển bộ lọc danh mục.</p><button class="btn" data-clear-search>Xóa tìm kiếm và bộ lọc</button></div>`}
    `;
  }

  function refreshResults(labels){
    const el=document.querySelector('#dish-results');
    if(el) el.innerHTML=results(labels);
  }

  A.renderMenu=()=>{
    const s=A.state;
    if(!s.dailyMenus || Object.keys(s.dailyMenus).length===0){
      D.generateMultiDayPlan(s);
      A.save();
    }
    if(currentDay<1 || currentDay>s.days) currentDay=s.day||1;
    const labels=getMealLabels(s.meals);
    if(active>=s.meals) active=0;

    const b=D.summary(s,currentDay);
    const dayDishes=D.menu(s,currentDay);
    const dailyBudget=s.days ? Math.floor(s.budget / s.days) : 0;
    const dailyEstimated=dayDishes.reduce((sum,d)=>sum+(d?d.cost:0),0);
    const isOverBudget=dailyEstimated>dailyBudget;
    const stock=Object.keys(D.ingredients).filter(k=>D.usable(s,k)>0);

    // Món đề xuất bữa tối đơn giản
    const dinnerCandidates=D.dishes.filter(d=>d.meal!=='Bữa sáng'&&D.allowed(d,s)).slice(0,4);

    return `
      <!-- Tabs chọn ngày: Ngày 1, Ngày 2... -->
      <nav class="day-tabs-wrapper" aria-label="Lịch theo ngày">
        <div class="day-tabs-list" role="tablist">
          ${Array.from({length: s.days}, (_, i) => i + 1).map(d => `
            <button type="button" class="day-tab-btn ${currentDay === d ? 'active' : ''}" data-day-tab="${d}" role="tab" aria-selected="${currentDay === d}">
              Ngày ${d}
            </button>
          `).join('')}
        </div>
      </nav>

      <!-- Tiêu đề và Tóm tắt -->
      <div class="menu-header-group">
        <div class="row between">
          <h1>Thực đơn ngày ${currentDay}</h1>
          <span class="badge ${s.confirmed && currentDay===s.day ? '' : 'neutral'}">${s.checkedOut && currentDay===s.day ? 'Đã hoàn tất' : s.confirmed && currentDay===s.day ? 'Đã chốt thực đơn' : 'Đề xuất mẫu'}</span>
        </div>
        <p class="menu-summary-text">
          <strong>${money(s.budget)}</strong> cho <strong>${s.days} ngày</strong>, <strong>${s.meals} bữa mỗi ngày</strong>, mức <strong>${(s.nutrition||'tiết kiệm').toLowerCase()}</strong>, ưu tiên: <strong>${s.preferences && s.preferences.length ? s.preferences.join(', ').toLowerCase() : 'không kiêng'}</strong>. Món ăn và giá bên dưới là dữ liệu mẫu để minh họa bố cục.
        </p>
      </div>

      <!-- Alert Box cảnh báo/đề xuất ngân sách -->
      ${isOverBudget ? `
        <div class="budget-alert-box warning" role="alert">
          <p>Chi phí dự kiến đang cao hơn ngân sách của ngày. Hệ thống sẽ đề xuất điều chỉnh, chẳng hạn giảm số bữa, bớt món hoặc chọn món rẻ hơn.</p>
        </div>
      ` : `
        <div class="budget-alert-box success" role="status">
          <p>Chi phí dự kiến nằm trong ngân sách ngày của bạn (${money(dailyBudget)}). Bạn có thể thêm món cho bữa ăn nếu ngân sách còn dồi dào hoặc điều chỉnh theo ý thích.</p>
        </div>
      `}

      <!-- Banner tiêu chí thông minh: Tủ lạnh & Không trùng nguyên liệu chính 2-3 ngày -->
      <div class="smart-criteria-strip">
        <div class="criteria-pill">
          ${icon('fridge')}
          <span><strong>Ưu tiên đồ tủ lạnh:</strong> Tận dụng trước đồ sắp hết hạn, mua thêm nếu thiếu</span>
        </div>
        <div class="criteria-pill">
          ${icon('swap')}
          <span><strong>Xoay tua nguyên liệu:</strong> Không trùng nguyên liệu chính (gà, trứng, đậu, thịt...) trong 2–3 ngày</span>
        </div>
        <div class="criteria-pill">
          ${icon('plus')}
          <span><strong>Linh hoạt nhiều món:</strong> Cho phép thêm 2-3 món (canh, mặn, xào) trong mỗi bữa ăn</span>
        </div>
      </div>

      <!-- 3 Thẻ thống kê: Ngân sách ngày, Chi phí dự kiến, Ngân sách còn lại -->
      <div class="menu-stats-row">
        <article class="stat-box">
          <span class="stat-title">Ngân sách cho ngày ${currentDay}</span>
          <strong class="stat-number number">${money(dailyBudget)}</strong>
        </article>
        <article class="stat-box">
          <span class="stat-title">Chi phí dự kiến</span>
          <strong class="stat-number number ${isOverBudget ? 'over-budget' : 'on-budget'}">${money(dailyEstimated)}</strong>
        </article>
        <article class="stat-box">
          <span class="stat-title">Ngân sách còn lại (cả kỳ)</span>
          <strong class="stat-number number">${money(b.remaining)}</strong>
          <small class="stat-footnote">${s.logs.length ? 'Đã chi ' + money(b.spent) : 'Chưa có chi phí thực tế'}</small>
        </article>
      </div>

      <!-- Phần: Món ăn trong ngày (Hỗ trợ nhiều món cho mỗi bữa) -->
      <section class="daily-menu-section" aria-labelledby="daily-menu-heading">
        <div class="menu-section-heading">
          <div>
            <h2 id="daily-menu-heading">Món ăn trong ngày</h2>
            <p>Mỗi bữa có thể chọn 1 hoặc nhiều món (món mặn, món canh, món xào...). Nhấn “+ Thêm món” để thêm món vào bữa bạn thích.</p>
          </div>
        </div>

        <div class="daily-meal-cards-stack">
          ${Array.from({length: s.meals}, (_, idx) => {
            const label=getMealLabel(s, idx);
            const dishesInMeal=D.getDayMealDishes(s, currentDay, idx);
            const mealTotalCost=dishesInMeal.reduce((sum, d)=>sum+(d?d.cost:0), 0);
            return `
              <div class="meal-block ${active===idx?'is-active':''}">
                <div class="meal-block-header">
                  <div class="meal-block-title">
                    <span class="meal-badge">${label}</span>
                    <strong class="meal-cost-badge number">${money(mealTotalCost)}</strong>
                    <span class="meal-dish-count">(${dishesInMeal.length} món)</span>
                  </div>
                  <button class="btn small primary btn-add-more" data-start-add-dish="${idx}">
                    ${icon('plus')} Thêm món vào ${label.toLowerCase()}
                  </button>
                </div>

                <div class="meal-dishes-sublist">
                  ${dishesInMeal.length===0 ? `
                    <div class="empty-meal-hint">Chưa có món nào cho bữa này. Bấm nút “Thêm món” bên trên để chọn món.</div>
                  ` : dishesInMeal.map(d => {
                    const ingredientDesc=d.needs ? Object.entries(d.needs).map(([k,q])=>{
                      const ing=D.ingredients[k]||{name:k,unit:''};
                      return `${q} ${ing.unit} ${ing.name.toLowerCase()}`;
                    }).join(', ') : '';
                    return `
                      <article class="subdish-item">
                        <div class="subdish-main-info">
                          <div class="subdish-name-line">
                            <strong class="subdish-name">${esc(d.name)}</strong>
                            <span class="subdish-tag">${d.category==='canh'?'Món canh':d.category==='rau'?'Món rau':'Món chính'}</span>
                            <strong class="subdish-price number">${money(d.cost)}</strong>
                          </div>
                          ${ingredientDesc ? `<p class="subdish-ingredients">${esc(ingredientDesc)}</p>` : ''}
                          ${availabilityBadge(s, d)}
                        </div>
                        <div class="subdish-controls">
                          <button class="btn small" data-edit-meal="${idx}" data-replace-target="${d.id}">${icon('swap')} Đổi món</button>
                          <button class="text-btn small" data-recipe="${d.id}">Cách nấu</button>
                          ${dishesInMeal.length > 1 ? `
                            <button class="text-btn small danger" data-remove-meal-dish="${d.id}" data-meal-slot="${idx}" title="Xóa món này khỏi bữa">✕ Xóa</button>
                          ` : ''}
                        </div>
                      </article>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Dòng xác nhận đề xuất & Thay thế bữa ăn -->
        <div class="menu-decision-bar">
          <button class="btn primary btn-confirm-plan" data-action="confirm-day-plan">
            ${icon('check')} Xác nhận đề xuất thực đơn ngày ${currentDay}
          </button>
          <button class="btn btn-swap-plan" data-action="regenerate-day-plan">
            ${icon('swap')} Gợi ý lại toàn bộ bữa ăn ngày này
          </button>
        </div>
      </section>

      <!-- Điểm chuyển giao tới Form Đăng nhập hoặc Đăng ký (Tự đề xuất) -->
      <section class="handoff-cta-banner" aria-label="Đề xuất món ăn riêng">
        <div class="handoff-cta-inner">
          <div class="handoff-icon-wrap">${icon('chef')}</div>
          <div class="handoff-copy">
            <span class="badge highlight">Tự đề xuất</span>
            <h3>Bạn muốn tự đề xuất ý tưởng món ăn riêng?</h3>
            <p>Trở thành thành viên của Bếp Sinh Viên để tự đề xuất món ăn yêu thích, tùy biến chi tiết dinh dưỡng cho từng bữa và đồng bộ thực đơn của bạn trên mọi thiết bị.</p>
          </div>
          <div class="handoff-cta-buttons">
            <a class="btn primary" href="login.html?tab=register&source=propose">Đăng ký tự đề xuất →</a>
            <a class="btn subtle" href="login.html?source=propose">Đăng nhập</a>
          </div>
        </div>
      </section>

      <!-- Mục: Đề xuất bữa tối đơn giản -->
      <section class="simple-dinner-section" aria-labelledby="simple-dinner-heading">
        <div class="menu-section-heading">
          <div>
            <h2 id="simple-dinner-heading">Đề xuất bữa tối đơn giản</h2>
            <p>Món ăn ngon, dễ chế biến trong 15-20 phút, nhẹ bụng và vừa túi tiền.</p>
          </div>
        </div>

        <div class="simple-dinner-grid">
          ${dinnerCandidates.map(d=>`
            <article class="dinner-food-card">
              <div class="dinner-thumb-container">
                <img src="assets/images/${d.image}" alt="${esc(d.name)}" loading="lazy">
                <span class="dinner-price-tag number">${money(d.cost)}</span>
              </div>
              <div class="dinner-card-content">
                <h3 class="dinner-dish-name">${esc(d.name)}</h3>
                <p class="dinner-dish-desc">${esc(d.desc||d.recipe)}</p>
                <div class="dinner-meta-line">
                  <span>${icon('clock')} ${d.time} phút</span>
                  <span class="dinner-meta-price number">${money(d.cost)}</span>
                </div>
                <div class="dinner-btn-row">
                  <button class="btn small primary" data-apply-dinner="${d.id}">Chọn cho bữa tối</button>
                  <button class="text-btn small" data-recipe="${d.id}">Cách nấu</button>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Thư viện tìm kiếm & thêm/thay thế món ăn cho bữa đang chọn -->
      <section class="menu-library" id="menu-library-section" aria-labelledby="library-title">
        <div class="menu-section-heading">
          <div>
            <h2 id="library-title">${isAddingMode ? `+ Thêm món vào ${labels[active].toLowerCase()} (Ngày ${currentDay})` : (replaceTargetDishId && D.dish(replaceTargetDishId) ? `Đổi món "${esc(D.dish(replaceTargetDishId).name)}" (${labels[active].toLowerCase()})` : `Thay thế món cho ${labels[active].toLowerCase()}`)}</h2>
            <p>Tự do lựa chọn trong thư viện món ăn của Bếp. Món tận dụng đồ có sẵn trong tủ lạnh được ưu tiên lên trước.</p>
          </div>
        </div>
        <div class="fridge-strip">
          ${icon('fridge')}
          <div>
            <strong>Trong tủ lạnh của bạn</strong>
            <p>${stock.length?stock.map(k=>esc(D.ingredients[k]?D.ingredients[k].name:k)).join(' · '):'Chưa có nguyên liệu còn hạn. Bạn vẫn có thể chọn món và mua thêm.'}</p>
          </div>
          <button class="text-btn" data-go="fridge">Xem tủ lạnh ${icon('arrow')}</button>
        </div>
        <div class="catalog-toolbar">
          <label class="field search-dishes">
            <span>Tìm tên món hoặc nguyên liệu</span>
            <input type="search" id="dish-search" placeholder="Thử: gà, trứng, đậu hũ, rau cải, canh..." value="${esc(query)}" autocomplete="off">
          </label>
          <label class="chip">
            <input type="checkbox" id="stock-only" ${stockOnly?'checked':''}>
            <span>Có đồ trong tủ lạnh</span>
          </label>
        </div>
        <div id="dish-results">${results(labels)}</div>
      </section>
    `;
  };

  document.addEventListener('input',e=>{
    if(e.target.id==='dish-search'){
      query=e.target.value;
      const labels=getMealLabels(A.state.meals);
      refreshResults(labels);
    }
  });

  document.addEventListener('change',e=>{
    const s=A.state,t=e.target;
    if(A.tab!=='menu') return;
    if(t.id==='stock-only'){
      stockOnly=t.checked;
      const labels=getMealLabels(s.meals);
      refreshResults(labels);
    }
  });

  document.addEventListener('click',e=>{
    const s=A.state;
    if(A.tab!=='menu') return;

    // Lọc theo danh mục món ăn (mặn, canh, rau, tất cả)
    const catBtn=e.target.closest('[data-cat]');
    if(catBtn){
      categoryFilter=catBtn.dataset.cat;
      const labels=getMealLabels(s.meals);
      refreshResults(labels);
      return;
    }

    // Chuyển tab ngày: Ngày 1, Ngày 2...
    const dayBtn=e.target.closest('[data-day-tab]');
    if(dayBtn){
      currentDay=Number(dayBtn.dataset.dayTab);
      query='';
      isAddingMode=false;
      A.render();
      return;
    }

    // Bấm nút "+ Thêm món vào bữa"
    const startAdd=e.target.closest('[data-start-add-dish]');
    if(startAdd){
      active=Number(startAdd.dataset.startAddDish);
      isAddingMode=true;
      replaceTargetDishId=null;
      query='';
      categoryFilter='all';
      A.render();
      const libSection=document.querySelector('#menu-library-section');
      if(libSection) libSection.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }

    // Chọn đổi món cụ thể
    const edit=e.target.closest('[data-edit-meal]');
    if(edit){
      active=Number(edit.dataset.editMeal);
      replaceTargetDishId=edit.dataset.replaceTarget||null;
      isAddingMode=false;
      query='';
      A.render();
      const libSection=document.querySelector('#menu-library-section');
      if(libSection) libSection.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }

    // Xóa một món khỏi bữa ăn
    const removeDish=e.target.closest('[data-remove-meal-dish]');
    if(removeDish){
      const dishId=removeDish.dataset.removeMealDish;
      const slot=Number(removeDish.dataset.mealSlot);
      D.removeDishFromMeal(s, currentDay, slot, dishId);
      A.save();
      A.render();
      A.toast('Đã xóa món khỏi bữa ăn.');
      return;
    }

    // Thêm món vào bữa đang active
    const addDish=e.target.closest('[data-add-to-meal]');
    if(addDish){
      const dishId=addDish.dataset.addToMeal;
      D.addDishToMeal(s, currentDay, active, dishId);
      A.save();
      A.render();
      const labels=getMealLabels(s.meals);
      A.toast(`Đã thêm "${D.dish(dishId).name}" vào ${labels[active].toLowerCase()} ngày ${currentDay}!`);
      return;
    }

    // Chọn đổi món cho bữa đang active
    const pick=e.target.closest('[data-pick-dish]');
    if(pick){
      try{
        const dishId=pick.dataset.pickDish;
        const oldId=replaceTargetDishId || (s.selected && s.selected[active]) || dishId;
        D.replaceDishInMeal(s, currentDay, active, oldId, dishId);
        replaceTargetDishId=null;
        A.save();
        A.render();
        const labels=getMealLabels(s.meals);
        A.toast(`Đã chọn "${D.dish(dishId).name}" cho ${labels[active].toLowerCase()} ngày ${currentDay}.`);
      }catch(err){
        A.toast(err.message);
      }
      return;
    }

    // Chọn nhanh món cho bữa tối từ phần "Đề xuất bữa tối đơn giản"
    const applyDinner=e.target.closest('[data-apply-dinner]');
    if(applyDinner){
      const dishId=applyDinner.dataset.applyDinner;
      const dinnerIdx=s.meals-1;
      D.replaceDishInMeal(s, currentDay, dinnerIdx, (s.selected[dinnerIdx]||dishId), dishId);
      A.save();
      A.render();
      A.toast(`Đã chọn "${D.dish(dishId).name}" cho bữa tối ngày ${currentDay}!`);
      return;
    }

    // Xác nhận đề xuất thực đơn ngày này
    if(e.target.closest('[data-action="confirm-day-plan"]')){
      if(currentDay===s.day){
        s.confirmed=true;
        A.save();
        A.go('shopping');
        A.toast(`Đã xác nhận thực đơn ngày ${currentDay}! Danh sách đi chợ đã sẵn sàng.`);
      }else{
        A.toast(`Đã xác nhận thực đơn đề xuất cho ngày ${currentDay}.`);
      }
      return;
    }

    // Gợi ý lại / Thay thế bữa ăn nếu chưa vừa ý
    if(e.target.closest('[data-action="regenerate-day-plan"]')){
      if(!s.dailyMenus) s.dailyMenus={};
      D.suggestMenu(s,currentDay);
      A.save();
      A.render();
      A.toast(`Đã thay thế và gợi ý lại các bữa ăn cho ngày ${currentDay} (ưu tiên đồ tủ lạnh & chống trùng món).`);
      return;
    }

    // Xóa tìm kiếm
    if(e.target.closest('[data-clear-search]')){
      query='';
      stockOnly=false;
      categoryFilter='all';
      A.render();
      const searchBox=document.querySelector('#dish-search');
      if(searchBox) searchBox.focus({preventScroll:true});
    }
  });
})();
