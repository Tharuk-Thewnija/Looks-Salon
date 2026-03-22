/**
 * Looks Salon — Booking System
 * Fully self-contained IIFE. Works as plain <script src="booking.js">.
 *
 * Every button wired:
 *  [data-open-booking]               → opens modal
 *  [data-open-booking][data-service] → opens modal pre-selecting a service
 *  .bm-close                         → closes modal
 *  .bm-backdrop                      → closes modal (click outside)
 *  ESC key                           → closes modal
 *  #bmBack                           → previous step
 *  #bmNext                           → next step / confirm
 *  .bm-svc-card                      → selects a service (step 1)
 *  #calPrev / #calNext               → month navigation (step 2)
 *  .bm-cal-cell (enabled)            → selects a date (step 2)
 *  .bm-time-slot (not booked)        → selects a time (step 2)
 *  #bmWhatsApp                       → opens WhatsApp with pre-filled message (step 4)
 */
(function () {
  'use strict';

  /* ═══════════════════════ DATA ═══════════════════════ */
  var SERVICES = [
    { id: 'barber',  icon: '✂️',  name: 'Barber Cut',     desc: 'Classic & modern cuts',        price: 'From LKR 800',   duration: '45 min' },
    { id: 'beard',   icon: '🧔',  name: 'Beard Grooming', desc: 'Shape, trim & hot towel',      price: 'From LKR 500',   duration: '30 min' },
    { id: 'colour',  icon: '🎨',  name: 'Hair Colour',    desc: 'Full colour & highlights',     price: 'From LKR 2,500', duration: '90 min' },
    { id: 'makeup',  icon: '💄',  name: 'Makeup',         desc: 'Party, bridal & editorial',    price: 'From LKR 3,000', duration: '60 min' },
    { id: 'facial',  icon: '✨',  name: 'Skin & Facial',  desc: 'Glow & treatment facials',     price: 'From LKR 1,800', duration: '60 min' },
    { id: 'styling', icon: '💇',  name: 'Hair Styling',   desc: 'Blowouts & special occasions', price: 'From LKR 1,200', duration: '45 min' }
  ];

  var ALL_SLOTS = [
    '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
    '11:00 AM','11:30 AM','12:00 PM',
    '1:30 PM','2:00 PM','2:30 PM',
    '3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM'
  ];

  var BOOKED = { '10:00 AM': true, '2:00 PM': true, '4:00 PM': true };

  var STYLISTS = ['No Preference', 'Chandana Wijesinghe', 'Senior Stylist', 'Available Stylist'];

  /* ═══════════════════════ STATE ═══════════════════════ */
  var state = {
    step: 1, service: null, date: null, time: null,
    name: '', phone: '', stylist: 'No Preference', notes: ''
  };
  var calYear = new Date().getFullYear();
  var calMonth = new Date().getMonth();

  /* ═══════════════════════ HELPERS ═══════════════════════ */
  function gid(id) { return document.getElementById(id); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function setText(id, val) { var e = gid(id); if (e) e.textContent = val; }

  /* ═══════════════════════ OPEN / CLOSE ═══════════════════════ */
  function openModal(serviceId) {
    var modal = gid('bookingModal');
    if (!modal) return;

    state.step = 1; state.service = null; state.date = null; state.time = null;
    state.name = ''; state.phone = ''; state.stylist = 'No Preference'; state.notes = '';
    calYear = new Date().getFullYear();
    calMonth = new Date().getMonth();

    var refEl = gid('bmRef');
    if (refEl) delete refEl.dataset.generated;

    if (serviceId) {
      for (var i = 0; i < SERVICES.length; i++) {
        if (SERVICES[i].id === serviceId) { state.service = SERVICES[i]; state.step = 2; break; }
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderStep();
  }

  function closeModal() {
    var modal = gid('bookingModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ═══════════════════════ VALIDATION ═══════════════════════ */
  function canProceed() {
    if (state.step === 1) return !!state.service;
    if (state.step === 2) return !!(state.date && state.time);
    if (state.step === 3) return state.name.length > 1 && state.phone.length > 6;
    return true;
  }

  function updateNextBtn() {
    var n = gid('bmNext');
    if (n) n.disabled = !canProceed();
  }

  /* ═══════════════════════ RENDER STEP ═══════════════════════ */
  function renderStep() {
    qsa('.bm-step').forEach(function (el, i) {
      el.classList.toggle('active', i + 1 === state.step);
      el.classList.toggle('done',   i + 1 <  state.step);
    });

    qsa('.bm-panel').forEach(function (el, i) {
      el.classList.toggle('active', i + 1 === state.step);
    });

    var back = gid('bmBack');
    if (back) back.style.display = state.step === 1 ? 'none' : 'flex';

    var next = gid('bmNext');
    if (next) {
      next.style.display = state.step === 4 ? 'none' : 'flex';
      next.innerHTML = state.step === 3
        ? 'Confirm Booking <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        : 'Continue <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      next.disabled = !canProceed();
    }

    var wa = gid('bmWhatsApp');
    if (wa) wa.style.display = state.step === 4 ? 'flex' : 'none';

    if (state.step === 1) renderStep1();
    if (state.step === 2) renderStep2();
    if (state.step === 3) renderStep3();
    if (state.step === 4) renderStep4();
  }

  /* ═══════════════════════ STEP 1 ═══════════════════════ */
  function renderStep1() {
    var grid = gid('bmServiceGrid');
    if (!grid) return;

    grid.innerHTML = SERVICES.map(function (svc) {
      var sel = state.service && state.service.id === svc.id ? ' selected' : '';
      return '<div class="bm-svc-card' + sel + '" data-svc="' + svc.id + '" role="button" tabindex="0">' +
        '<div class="bm-svc-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' +
        '<div class="bm-svc-icon">' + svc.icon + '</div>' +
        '<div class="bm-svc-name">' + svc.name + '</div>' +
        '<div class="bm-svc-desc">' + svc.desc + '</div>' +
        '<div class="bm-svc-price">' + svc.price + ' · ' + svc.duration + '</div>' +
        '</div>';
    }).join('');

    qsa('.bm-svc-card', grid).forEach(function (card) {
      function pick() {
        for (var i = 0; i < SERVICES.length; i++) {
          if (SERVICES[i].id === card.dataset.svc) { state.service = SERVICES[i]; break; }
        }
        qsa('.bm-svc-card', grid).forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        updateNextBtn();
      }
      card.addEventListener('click', pick);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
  }

  /* ═══════════════════════ STEP 2 ═══════════════════════ */
  function renderStep2() {
    buildCalendar(gid('bmCalendar'));
    buildTimeSlots(!!state.date);
  }

  function buildCalendar(container) {
    if (!container) return;
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    var today  = new Date(); today.setHours(0,0,0,0);
    var first  = new Date(calYear, calMonth, 1).getDay();
    var total  = new Date(calYear, calMonth + 1, 0).getDate();
    var prevLocked = (calYear === new Date().getFullYear() && calMonth === new Date().getMonth());

    container.innerHTML =
      '<div class="bm-cal-nav">' +
        '<button class="bm-cal-btn" id="calPrev"' + (prevLocked ? ' disabled style="opacity:0.28;cursor:not-allowed"' : '') + '>&#8249;</button>' +
        '<span class="bm-cal-month">' + MONTHS[calMonth] + ' ' + calYear + '</span>' +
        '<button class="bm-cal-btn" id="calNext">&#8250;</button>' +
      '</div>' +
      '<div class="bm-cal-days-header">' + DAYS.map(function(d){return '<div class="bm-cal-day-name">'+d+'</div>';}).join('') + '</div>' +
      '<div class="bm-cal-grid" id="calGrid"></div>';

    var grid = container.querySelector('#calGrid');

    for (var i = 0; i < first; i++) {
      grid.insertAdjacentHTML('beforeend', '<div class="bm-cal-cell empty"></div>');
    }
    for (var d = 1; d <= total; d++) {
      var cd  = new Date(calYear, calMonth, d);
      var dis = (cd < today) || (cd.getDay() === 0);
      var cls = 'bm-cal-cell' +
        (dis ? ' disabled' : '') +
        (cd.toDateString() === today.toDateString() ? ' today' : '') +
        (state.date && cd.toDateString() === state.date.toDateString() ? ' selected' : '');
      grid.insertAdjacentHTML('beforeend',
        '<div class="' + cls + '" data-y="' + calYear + '" data-m="' + calMonth + '" data-d="' + d + '"' +
        (!dis ? ' role="button" tabindex="0"' : '') + '>' + d + '</div>');
    }

    if (!prevLocked) {
      container.querySelector('#calPrev').addEventListener('click', function () {
        calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
        buildCalendar(container);
      });
    }
    container.querySelector('#calNext').addEventListener('click', function () {
      calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
      buildCalendar(container);
    });

    qsa('.bm-cal-cell:not(.disabled):not(.empty)', grid).forEach(function (cell) {
      function pick() {
        state.date = new Date(+cell.dataset.y, +cell.dataset.m, +cell.dataset.d);
        state.time = null;
        buildCalendar(container);
        buildTimeSlots(true);
        updateNextBtn();
      }
      cell.addEventListener('click', pick);
      cell.addEventListener('keydown', function (e) { if (e.key==='Enter'||e.key===' '){e.preventDefault();pick();} });
    });
  }

  function buildTimeSlots(show) {
    var container = gid('bmTimeSlots');
    if (!container) return;
    if (!show) {
      container.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;padding:16px 0;text-align:center;">← Pick a date first</p>';
      return;
    }
    container.innerHTML = ALL_SLOTS.map(function (slot) {
      var booked = !!BOOKED[slot], selected = state.time === slot;
      return '<div class="bm-time-slot' + (booked?' booked':'') + (selected?' selected':'') + '"' +
        ' data-slot="' + slot + '"' + (!booked ? ' role="button" tabindex="0"' : ' aria-disabled="true"') + '>' +
        '<span>' + slot + '</span>' +
        '<span class="bm-time-badge ' + (booked?'booked':'available') + '">' + (booked?'Booked':'Open') + '</span>' +
        '</div>';
    }).join('');

    qsa('.bm-time-slot:not(.booked)', container).forEach(function (el) {
      function pick() { state.time = el.dataset.slot; buildTimeSlots(true); updateNextBtn(); }
      el.addEventListener('click', pick);
      el.addEventListener('keydown', function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick();}});
    });
  }

  /* ═══════════════════════ STEP 3 ═══════════════════════ */
  function renderStep3() {
    setText('smService', state.service ? state.service.name : '—');
    setText('smDate', state.date ? state.date.toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric'}) : '—');
    setText('smTime', state.time || '—');

    var sel = gid('bmStylist');
    if (sel && sel.options.length === 0) {
      STYLISTS.forEach(function(s){ var o=document.createElement('option'); o.value=o.textContent=s; sel.appendChild(o); });
    }
    if (sel) { sel.value = state.stylist; sel.onchange = function(){ state.stylist = sel.value; }; }

    var ne = gid('bmName');
    if (ne) { ne.value = state.name; ne.oninput = function(){ state.name = ne.value.trim(); updateNextBtn(); }; }

    var pe = gid('bmPhone');
    if (pe) { pe.value = state.phone; pe.oninput = function(){ state.phone = pe.value.trim(); updateNextBtn(); }; }

    var no = gid('bmNotes');
    if (no) { no.value = state.notes; no.oninput = function(){ state.notes = no.value; }; }
  }

  /* ═══════════════════════ STEP 4 ═══════════════════════ */
  function renderStep4() {
    var dateStr = state.date
      ? state.date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}) : '—';

    setText('cfService', state.service ? state.service.name : '—');
    setText('cfDate',    dateStr);
    setText('cfTime',    state.time || '—');
    setText('cfName',    state.name || '—');
    setText('cfStylist', state.stylist || 'No Preference');

    var refEl = gid('bmRef');
    if (refEl && !refEl.dataset.generated) {
      refEl.textContent = 'LKS-' + Date.now().toString(36).toUpperCase().slice(-6);
      refEl.dataset.generated = '1';
    }

    var waBtn = gid('bmWhatsApp');
    if (waBtn) {
      var lines = [
        'Hello Looks Salon! I would like to confirm an appointment.',
        '',
        'Service : ' + (state.service ? state.service.name : ''),
        'Date    : ' + dateStr,
        'Time    : ' + (state.time || ''),
        'Name    : ' + state.name,
        'Phone   : ' + state.phone,
        'Stylist : ' + (state.stylist || 'No Preference')
      ];
      if (state.notes) lines.push('Notes   : ' + state.notes);
      waBtn.href = 'https://wa.me/94757705308?text=' + encodeURIComponent(lines.join('\n'));
    }

    showToast('All done! Tap "Confirm via WhatsApp" to lock it in.');
  }

  /* ═══════════════════════ TOAST ═══════════════════════ */
  function showToast(msg) {
    var old = gid('bmToast'); if (old) old.remove();
    var t = document.createElement('div');
    t.id = 'bmToast'; t.className = 'bm-toast';
    t.innerHTML = '<span class="bm-toast-icon">✅</span><span class="bm-toast-text">' + msg + '</span>';
    document.body.appendChild(t);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ t.classList.add('show'); }); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ if(t.parentNode)t.parentNode.removeChild(t); }, 400); }, 4500);
  }

  /* ═══════════════════════ BOOT ═══════════════════════ */
  function boot() {
    var modal = gid('bookingModal');
    if (!modal) { console.error('Booking: #bookingModal not found in DOM'); return; }

    // Close ×
    var x = modal.querySelector('.bm-close');
    if (x) x.addEventListener('click', closeModal);

    // Backdrop
    var bd = modal.querySelector('.bm-backdrop');
    if (bd) bd.addEventListener('click', closeModal);

    // ESC
    document.addEventListener('keydown', function(e){
      if (e.key==='Escape' && modal.classList.contains('open')) closeModal();
    });

    // Next / Confirm
    var nextBtn = gid('bmNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', function(){
        if (nextBtn.disabled || !canProceed()) return;
        if (state.step < 4) {
          state.step++;
          renderStep();
          var body = modal.querySelector('.bm-body');
          if (body) body.scrollTop = 0;
        }
      });
    }

    // Back
    var backBtn = gid('bmBack');
    if (backBtn) {
      backBtn.addEventListener('click', function(){
        if (state.step > 1) {
          state.step--;
          renderStep();
          var body = modal.querySelector('.bm-body');
          if (body) body.scrollTop = 0;
        }
      });
    }

    // All open-booking triggers (delegated — catches nav, hero, drawer, section, service tiles)
    document.addEventListener('click', function(e){
      var trigger = e.target.closest('[data-open-booking]');
      if (!trigger) return;
      e.preventDefault();
      openModal(trigger.dataset.service || null);
    });

    renderStep();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
