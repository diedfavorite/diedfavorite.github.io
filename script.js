let highestZIndex = 100;
const isMobile = () => window.innerWidth <= 900 || ('ontouchstart' in window && window.innerWidth <= 1200);
const openWindows = new Set(['window-hero']);
const desktop = document.getElementById('desktop');

document.getElementById('window-hero').classList.add('active');

// No special window hiding on mobile startup anymore - full desktop parity
// if (isMobile()) { ... }


function pad(n) { return n < 10 ? '0' + n : String(n); }

// animationend that only fires for the element itself, not bubbled children
function onSelfAnimEnd(el, fn) {
  const h = (e) => { if (e.target !== el) return; el.removeEventListener('animationend', h); fn(); };
  el.addEventListener('animationend', h);
}

function deselectAllIcons() {
  document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
}

function focusLastOpenWindow() {
  const visible = Array.from(openWindows).filter(id => !document.getElementById(id).classList.contains('hidden'));
  if (visible.length > 0) bringToFront(visible[visible.length - 1]);
}

let _lastMinute = -1;
const _clockEl = document.getElementById('clock');
const _trayDateEl = document.getElementById('tray-date');
const _days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const _months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function updateTray() {
  const now = new Date();
  let h = now.getHours();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  const min = now.getMinutes();
  _clockEl.innerText = h + ':' + pad(min) + ' ' + ampm;
  if (min !== _lastMinute) {
    _lastMinute = min;
    _clockEl.classList.remove('clock-tick');
    void _clockEl.offsetWidth;
    _clockEl.classList.add('clock-tick');
    onSelfAnimEnd(_clockEl, () => _clockEl.classList.remove('clock-tick'));
    _trayDateEl.innerText = _days[now.getDay()] + ' ' + _months[now.getMonth()] + ' ' + now.getDate();
  }
}
updateTray();
setInterval(updateTray, 1000);

function selectIcon(id) {
  deselectAllIcons();
  const el = document.getElementById(id);
  el.classList.add('selected');
  el.classList.remove('icon-select-flash');
  void el.offsetWidth;
  el.classList.add('icon-select-flash');
  onSelfAnimEnd(el, () => el.classList.remove('icon-select-flash'));
}

// Desktop icon double-click bounce feedback
document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    icon.classList.remove('icon-opening');
    void icon.offsetWidth;
    icon.classList.add('icon-opening');
    onSelfAnimEnd(icon, () => icon.classList.remove('icon-opening'));
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.desktop-icon')) deselectAllIcons();
  if (!e.target.closest('.recycle-file')) {
    document.querySelectorAll('.recycle-file').forEach(f => f.classList.remove('selected'));
  }
});

function selectRecycleFile(el) {
  document.querySelectorAll('.recycle-file').forEach(f => f.classList.remove('selected'));
  el.classList.add('selected');
}

function bringToFront(id) {
  const el = document.getElementById(id);
  if (!el) return;
  highestZIndex++;
  el.style.zIndex = highestZIndex;
  document.querySelectorAll('.desktop-window').forEach(win => win.classList.remove('active', 'titlebar-flash'));
  el.classList.add('active');
  void el.offsetWidth;
  el.classList.add('titlebar-flash');
  const tb = el.querySelector('.title-bar');
  if (tb) onSelfAnimEnd(tb, () => el.classList.remove('titlebar-flash'));
  document.querySelectorAll('.taskbar-item').forEach(btn => btn.classList.remove('active'));
  const tbItem = document.getElementById(`tb-${id}`);
  if (tbItem) tbItem.classList.add('active');
}

function openWindow(id) {
  // Always close start menu when opening a window
  closeStartMenu();

  // Full window management on all devices

  const el = document.getElementById(id);
  if (!el) return;
  delete el.dataset.closing;
  delete el.dataset.minimizing;
  el.classList.remove('hidden', 'win-closing', 'win-minimize');
  void el.offsetWidth;
  el.classList.add('win-opening');
  onSelfAnimEnd(el, () => el.classList.remove('win-opening'));
  const isNew = !openWindows.has(id);
  openWindows.add(id);
  bringToFront(id);
  renderTaskbar();
  if (isNew) {
    const tbBtn = document.getElementById(`tb-${id}`);
    if (tbBtn) {
      tbBtn.classList.add('tb-new');
      onSelfAnimEnd(tbBtn, () => tbBtn.classList.remove('tb-new'));
    }
  }
}

function closeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.dataset.closing = '1';
  el.classList.add('win-closing');
  onSelfAnimEnd(el, () => {
    if (!el.dataset.closing) return;
    delete el.dataset.closing;
    el.classList.remove('win-closing');
    el.classList.add('hidden');
    el.classList.remove('active');
    openWindows.delete(id);
    renderTaskbar();
    focusLastOpenWindow();
  });
}

function minimizeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.dataset.minimizing = '1';
  el.classList.add('win-minimize');
  onSelfAnimEnd(el, () => {
    if (!el.dataset.minimizing) return;
    delete el.dataset.minimizing;
    el.classList.remove('win-minimize');
    el.classList.add('hidden');
    el.classList.remove('active');
    renderTaskbar();
    focusLastOpenWindow();
  });
}

function maximizeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('maximized');
  el.classList.remove('win-maximize');
  void el.offsetWidth;
  el.classList.add('win-maximize');
  onSelfAnimEnd(el, () => el.classList.remove('win-maximize'));
  bringToFront(id);
}

// Point the menu's transform-origin at the Start button's TOP edge center —
// the exact line where the button and menu visually connect.
function anchorMenuToButton() {
  const btn  = document.getElementById('start-btn');
  const menu = document.getElementById('start-menu');
  if (!btn || !menu) return;

  const btnRect = btn.getBoundingClientRect();
  // Horizontal: center of the button  |  Vertical: top of the button (= where menu exits)
  const btnX = btnRect.left + btnRect.width / 2;
  const btnY = btnRect.top;

  // If menu is hidden, briefly unhide (invisible) to read its rect
  let menuRect = menu.getBoundingClientRect();
  if (!menuRect.height) {
    menu.style.visibility = 'hidden';
    menu.classList.remove('hidden');
    menuRect = menu.getBoundingClientRect();
    menu.classList.add('hidden');
    menu.style.visibility = '';
  }

  const ox = btnX - menuRect.left;   // horiz center of button, relative to menu left
  const oy = btnY - menuRect.top;    // button's top edge = menu's bottom edge (connection point)
  menu.style.transformOrigin = `${ox}px ${oy}px`;
}

function closeStartMenu() {
  const menu = document.getElementById('start-menu');
  if (!menu || menu.classList.contains('hidden') || menu.dataset.closing) return;
  anchorMenuToButton();
  menu.dataset.closing = '1';
  menu.classList.remove('start-opening');
  menu.classList.add('start-closing');
  onSelfAnimEnd(menu, () => {
    delete menu.dataset.closing;
    menu.classList.remove('start-closing');
    menu.classList.add('hidden');
    // Button absorbs the menu back — brief pulse
    const btn = document.getElementById('start-btn');
    if (btn) {
      btn.classList.remove('start-btn-absorb');
      void btn.offsetWidth;
      btn.classList.add('start-btn-absorb');
      onSelfAnimEnd(btn, () => btn.classList.remove('start-btn-absorb'));
    }
  });
}

function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  if (menu.classList.contains('hidden')) {
    anchorMenuToButton();
    // Button ejects the menu — brief push flash
    const btn = document.getElementById('start-btn');
    if (btn) {
      btn.classList.remove('start-btn-eject');
      void btn.offsetWidth;
      btn.classList.add('start-btn-eject');
      onSelfAnimEnd(btn, () => btn.classList.remove('start-btn-eject'));
    }
    menu.classList.remove('hidden');
    menu.classList.remove('start-opening');
    void menu.offsetWidth;
    menu.classList.add('start-opening');
    onSelfAnimEnd(menu, () => menu.classList.remove('start-opening'));
    menu.querySelectorAll('.menu-item').forEach((item, i) => {
      item.classList.remove('menu-item-anim');
      void item.offsetWidth;
      item.style.animationDelay = (i * 0.04) + 's';
      item.classList.add('menu-item-anim');
      onSelfAnimEnd(item, () => { item.classList.remove('menu-item-anim'); item.style.animationDelay = ''; });
    });
    highestZIndex++;
    menu.style.zIndex = highestZIndex;
  } else {
    closeStartMenu();
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.start-menu') && !e.target.closest('.start-btn')) {
    closeStartMenu();
  }
});

// ═══════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════
const WINDOW_HOTKEYS = {
  '1': 'window-hero',
  '2': 'window-beats',
  '3': 'window-loops',
  '4': 'window-video',
  '5': 'window-socials',
  '6': 'window-licensing',
};

document.addEventListener('keydown', (e) => {
  const inField   = e.target.matches('input, textarea, select');
  const inContent = e.target.closest('.window-body, .win95-window-content');

  // ── Ctrl / Cmd → toggle Start menu ──────────────────────────
  if ((e.key === 'Control' || e.key === 'Meta') && !e.altKey) {
    e.preventDefault();
    toggleStartMenu();
    return;
  }

  // ── Escape → close Start menu first, then active window ─────
  if (e.key === 'Escape') {
    const menu = document.getElementById('start-menu');
    if (menu && !menu.classList.contains('hidden')) {
      closeStartMenu();
    } else {
      const activeEl = document.querySelector('.desktop-window.active');
      if (activeEl) closeWindow(activeEl.id);
    }
    return;
  }

  // ── Alt+F4 → close active window (classic Win95) ────────────
  if (e.altKey && e.key === 'F4') {
    e.preventDefault();
    const activeEl = document.querySelector('.desktop-window.active');
    if (activeEl) closeWindow(activeEl.id);
    return;
  }

  // ── F-keys (work even inside content) ───────────────────────
  if (e.key === 'F1') { e.preventDefault(); openWindow('window-hero');    return; }
  if (e.key === 'F5') { e.preventDefault(); location.reload();            return; }

  // ── Space → play / pause active media in focused window ─────
  if (e.key === ' ' && !inField) {
    e.preventDefault();
    const activeEl = document.querySelector('.desktop-window.active');
    if (activeEl) {
      const playingMedia = activeEl.querySelector('audio:not([paused]), video:not([paused])');
      const anyMedia     = activeEl.querySelector('audio, video');
      if (playingMedia && !playingMedia.paused) {
        pauseMedia(playingMedia.id);
      } else if (anyMedia) {
        playMedia(anyMedia.id);
      }
    }
    return;
  }

  // Skip everything below when typing in a field or window content
  if (inField || inContent) return;

  // ── M → maximize / restore active window ────────────────────
  if (e.key === 'm' || e.key === 'M') {
    const activeEl = document.querySelector('.desktop-window.active');
    if (activeEl) maximizeWindow(activeEl.id);
    return;
  }

  // ── D → show desktop (minimize all) ────────────────────────
  if (e.key === 'd' || e.key === 'D') {
    showDesktop();
    return;
  }

  // ── R → open Recycle Bin ────────────────────────────────────
  if (e.key === 'r' || e.key === 'R') {
    openWindow('window-recyclebin');
    return;
  }

  // ── P → open Display Properties ────────────────────────────
  if (e.key === 'p' || e.key === 'P') {
    openWindow('window-display');
    return;
  }

  // ── Number keys 1–6 → open specific windows ─────────────────
  if (WINDOW_HOTKEYS[e.key]) {
    e.preventDefault();
    openWindow(WINDOW_HOTKEYS[e.key]);
    return;
  }

  // ── Arrow keys → window management ──────────────────────────
  if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
  e.preventDefault();

  const wins = Array.from(openWindows);
  if (wins.length === 0) return;

  const activeEl = document.querySelector('.desktop-window.active');
  const activeId = activeEl?.id ?? null;
  const idx      = activeId ? wins.indexOf(activeId) : 0;

  if      (e.key === 'ArrowUp')    { if (activeId) openWindow(activeId); }
  else if (e.key === 'ArrowDown')  { if (activeId) minimizeWindow(activeId); }
  else if (e.key === 'ArrowLeft')  { openWindow(wins[(idx - 1 + wins.length) % wins.length]); }
  else if (e.key === 'ArrowRight') { openWindow(wins[(idx + 1) % wins.length]); }
});

// Window dragging with delay/echo effect (like music delay)
let dragWin = null, dragOffX, dragOffY;
let dragTargetX = 0, dragTargetY = 0;
let dragRafId = null;

function dragAnimLoop() {
  if (!dragWin) { dragRafId = null; return; }
  const winW = dragWin.offsetWidth;
  const titleH = dragWin._titleBar ? dragWin._titleBar.offsetHeight : 28;
  const deskW = desktop.offsetWidth;
  const deskH = desktop.offsetHeight;
  const clampedX = Math.max(-(winW - 60), Math.min(dragTargetX, deskW - 60));
  const clampedY = Math.max(0, Math.min(dragTargetY, deskH - titleH));
  const curX = parseFloat(dragWin.style.left) || 0;
  const curY = parseFloat(dragWin.style.top) || 0;
  dragWin.style.left = (curX + (clampedX - curX) * 0.18) + 'px';
  dragWin.style.top  = (curY + (clampedY - curY) * 0.18) + 'px';
  dragRafId = requestAnimationFrame(dragAnimLoop);
}

document.querySelectorAll('.draggable').forEach(windowEl => {
  const titleBar = windowEl.querySelector('.title-bar');
  if (!titleBar) return;
  windowEl._titleBar = titleBar; // cache for drag loop
  windowEl.addEventListener('mousedown', () => bringToFront(windowEl.id));
  titleBar.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    if (windowEl.classList.contains('maximized')) return;
    dragWin = windowEl;
    const rect = windowEl.getBoundingClientRect();
    dragOffX = e.clientX - rect.left;
    dragOffY = e.clientY - rect.top;
    
    // Force absolute pixel values instead of percentages to fix jumping
    windowEl.style.left = windowEl.offsetLeft + 'px';
    windowEl.style.top = windowEl.offsetTop + 'px';
    dragTargetX = windowEl.offsetLeft;
    dragTargetY = windowEl.offsetTop;
    
    document.body.style.userSelect = 'none';
    if (!dragRafId) dragRafId = requestAnimationFrame(dragAnimLoop);
  });
  // Touch drag support - enabled for all devices
  titleBar.addEventListener('touchstart', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;

    if (windowEl.classList.contains('maximized')) return;
    bringToFront(windowEl.id);
    const t = e.touches[0];
    dragWin = windowEl;
    const rect = windowEl.getBoundingClientRect();
    dragOffX = t.clientX - rect.left;
    dragOffY = t.clientY - rect.top;
    
    windowEl.style.left = windowEl.offsetLeft + 'px';
    windowEl.style.top = windowEl.offsetTop + 'px';
    dragTargetX = windowEl.offsetLeft;
    dragTargetY = windowEl.offsetTop;
    
    if (!dragRafId) dragRafId = requestAnimationFrame(dragAnimLoop);
  }, { passive: true });
});

document.addEventListener('mousemove', (e) => {
  if (!dragWin) return;
  const desktopRect = desktop.getBoundingClientRect();
  dragTargetX = e.clientX - desktopRect.left - dragOffX;
  dragTargetY = e.clientY - desktopRect.top - dragOffY;
});
document.addEventListener('touchmove', (e) => {
  if (!dragWin) return;
  const t = e.touches[0];
  const desktopRect = desktop.getBoundingClientRect();
  dragTargetX = t.clientX - desktopRect.left - dragOffX;
  dragTargetY = t.clientY - desktopRect.top - dragOffY;
}, { passive: true });

document.addEventListener('mouseup', () => {
  if (!dragWin) return;
  dragWin = null;
  document.body.style.userSelect = '';
});
document.addEventListener('touchend', () => { dragWin = null; });

function renderTaskbar() {
  const container = document.getElementById('taskbar-items');
  container.innerHTML = '';
  openWindows.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const titleEl = el.querySelector('.title-bar-text');
    if (!titleEl) return;
    const title = titleEl.innerText;
    const isHidden = el.classList.contains('hidden');
    const isActive = el.classList.contains('active') && !isHidden;
    const btn = document.createElement('button');
    btn.className = `taskbar-item ${isActive ? 'active' : ''}`;
    btn.id = `tb-${id}`;
    btn.innerHTML = `<span>${title}</span>`;
    btn.onclick = () => {
      btn.classList.remove('taskbar-press');
      void btn.offsetWidth;
      btn.classList.add('taskbar-press');
      onSelfAnimEnd(btn, () => btn.classList.remove('taskbar-press'));
      // check live state at click time, not stale render-time value
      const nowHidden = el.classList.contains('hidden');
      const nowActive = el.classList.contains('active');
      if (!nowHidden && nowActive) {
        minimizeWindow(id);
      } else {
        openWindow(id);
      }
    };
    btn.classList.add('taskbar-item-enter');
    requestAnimationFrame(() => onSelfAnimEnd(btn, () => btn.classList.remove('taskbar-item-enter')));
    container.appendChild(btn);
  });
}

renderTaskbar();

function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  return pad(Math.floor(seconds / 60)) + ':' + pad(Math.floor(seconds % 60));
}

function updateMediaTime(id) {
  const media = document.getElementById(id);
  const slider = document.getElementById(`slider-${id}`);
  const timeDisplay = document.getElementById(`time-${id}`);
  if (!media || !slider || !timeDisplay) return;
  if (media.duration) {
    slider.max = media.duration;
    slider.value = media.currentTime;
  }
  timeDisplay.innerText = formatTime(media.currentTime);
}

function playMedia(id) {
  const media = document.getElementById(id);
  if (!media) return;
  document.querySelectorAll('audio, video').forEach(el => {
    if (el.id !== id) {
      el.pause();
      const t = el.closest('.win95-media-player')?.querySelector('.media-title');
      if (t) t.classList.remove('playing');
    }
  });
  const p = media.play();
  if (p !== undefined) p.catch(() => {});
  const title = media.closest('.win95-media-player')?.querySelector('.media-title');
  if (title) title.classList.add('playing');
}

function pauseMedia(id) {
  const el = document.getElementById(id);
  if (el) {
    el.pause();
    const title = el.closest('.win95-media-player')?.querySelector('.media-title');
    if (title) title.classList.remove('playing');
  }
}

function stopMedia(id) {
  const el = document.getElementById(id);
  if (el) {
    el.pause(); el.currentTime = 0;
    const title = el.closest('.win95-media-player')?.querySelector('.media-title');
    if (title) title.classList.remove('playing');
  }
}

function seekMedia(id, timeVal) {
  const el = document.getElementById(id);
  if (el) el.currentTime = timeVal;
  const timeDisplay = document.getElementById(`time-${id}`);
  if (timeDisplay) {
    timeDisplay.classList.remove('time-flash');
    void timeDisplay.offsetWidth;
    timeDisplay.classList.add('time-flash');
    onSelfAnimEnd(timeDisplay, () => timeDisplay.classList.remove('time-flash'));
  }
}

function fullscreenVideo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
}

let globalVolume = 1;

function applyVolume() {
  const muted = document.getElementById('mute-check').checked;
  document.querySelectorAll('audio, video').forEach(el => { el.volume = muted ? 0 : globalVolume; });
}

function setGlobalVolume(val) {
  globalVolume = val / 100;
  const label = document.getElementById('volume-label');
  label.innerText = val;
  label.classList.remove('vol-flash');
  void label.offsetWidth;
  label.classList.add('vol-flash');
  onSelfAnimEnd(label, () => label.classList.remove('vol-flash'));
  applyVolume();
}

function toggleMute() {
  applyVolume();
}

function toggleVolumePopup(e) {
  e.stopPropagation();
  const popup = document.getElementById('volume-popup');
  if (popup.classList.contains('hidden')) {
    popup.classList.remove('hidden', 'popup-in');
    void popup.offsetWidth;
    popup.classList.add('popup-in');
    onSelfAnimEnd(popup, () => popup.classList.remove('popup-in'));
  } else {
    popup.classList.add('hidden');
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('#volume-popup') && !e.target.closest('[title="Volume"]')) {
    document.getElementById('volume-popup')?.classList.add('hidden');
  }
});

// Desktop icon dragging + touch open
let dragIcon = null, iconStartX, iconStartY, iconOrigLeft, iconOrigTop, iconMoved;

document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    icon.classList.remove('icon-pop');
    void icon.offsetWidth;
    icon.classList.add('icon-pop');
    onSelfAnimEnd(icon, () => icon.classList.remove('icon-pop'));
  });

  // Mouse drag
  icon.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragIcon = icon;
    iconMoved = false;
    iconStartX = e.clientX;
    iconStartY = e.clientY;
    iconOrigLeft = icon.offsetLeft;
    iconOrigTop = icon.offsetTop;
    icon.style.zIndex = 9000;
    icon.classList.add('dragging');
    document.body.style.userSelect = 'none';
    e.stopPropagation();
  });

  // Touch drag + single-tap to open on mobile
  icon.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    dragIcon = icon;
    iconMoved = false;
    iconStartX = t.clientX;
    iconStartY = t.clientY;
    iconOrigLeft = icon.offsetLeft;
    iconOrigTop = icon.offsetTop;
    icon.style.zIndex = 9000;
    icon.classList.add('dragging');
  }, { passive: true });
});

document.addEventListener('mousemove', (e) => {
  if (!dragIcon) return;
  const dx = e.clientX - iconStartX;
  const dy = e.clientY - iconStartY;
  if (!iconMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) iconMoved = true;
  if (!iconMoved) return;
  dragIcon.style.left = Math.max(0, Math.min(iconOrigLeft + dx, desktop.offsetWidth - dragIcon.offsetWidth)) + 'px';
  dragIcon.style.top = Math.max(0, Math.min(iconOrigTop + dy, desktop.offsetHeight - dragIcon.offsetHeight)) + 'px';
});

document.addEventListener('touchmove', (e) => {
  if (!dragIcon) return;
  const t = e.touches[0];
  const dx = t.clientX - iconStartX;
  const dy = t.clientY - iconStartY;
  if (!iconMoved && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) iconMoved = true;
  if (!iconMoved) return;
  dragIcon.style.left = Math.max(0, Math.min(iconOrigLeft + dx, desktop.offsetWidth - dragIcon.offsetWidth)) + 'px';
  dragIcon.style.top = Math.max(0, Math.min(iconOrigTop + dy, desktop.offsetHeight - dragIcon.offsetHeight)) + 'px';
}, { passive: true });

document.addEventListener('mouseup', (e) => {
  if (!dragIcon) return;
  dragIcon.style.zIndex = '';
  dragIcon.classList.remove('dragging');
  document.body.style.userSelect = '';
  if (iconMoved) e.stopImmediatePropagation();
  dragIcon = null;
});

document.addEventListener('touchend', (e) => {
  if (!dragIcon) return;
  const icon = dragIcon;
  icon.style.zIndex = '';
  icon.classList.remove('dragging');
  dragIcon = null;
  if (!iconMoved) {
    // Single tap on mobile = select + open
    const windowId = 'window-' + icon.id.replace('icon-', '');
    selectIcon(icon.id);
    icon.classList.remove('icon-pop');
    void icon.offsetWidth;
    icon.classList.add('icon-pop');
    onSelfAnimEnd(icon, () => icon.classList.remove('icon-pop'));
    openWindow(windowId);
  }
});

function switchHeroTab(tab) {
  ['welcome', 'whatsnew', 'online'].forEach(t => {
    const panel = document.getElementById(`tab-${t}`);
    const btn   = document.getElementById(`tab-btn-${t}`);
    if (!panel || !btn) return;
    const active = t === tab;
    panel.style.display = active ? 'flex' : 'none';
    if (active) {
      panel.classList.remove('tab-slide');
      void panel.offsetWidth;
      panel.classList.add('tab-slide');
      onSelfAnimEnd(panel, () => panel.classList.remove('tab-slide'));
      btn.classList.add('win95-tab-active');
    } else {
      btn.classList.remove('win95-tab-active');
    }
  });
}


function switchVideo(src, label, index) {
  const video = document.getElementById('video-main');
  const slider = document.getElementById('slider-video-main');
  const timeDisplay = document.getElementById('time-video-main');
  const wasPlaying = !video.paused;
  video.pause();
  video.src = src;
  video.load();
  if (slider) { slider.value = 0; slider.max = 0; }
  if (timeDisplay) timeDisplay.innerText = '00:00';
  const status = document.getElementById('video-status');
  if (status) status.innerText = label;
  for (let i = 0; i < 3; i++) {
    const item = document.getElementById(`vpl-${i}`);
    if (!item) continue;
    item.style.background = i === index ? '#000080' : '';
    item.style.color = i === index ? '#fff' : '';
    if (i === index) {
      item.classList.remove('playlist-select');
      void item.offsetWidth;
      item.classList.add('playlist-select');
      onSelfAnimEnd(item, () => item.classList.remove('playlist-select'));
    }
  }
  if (wasPlaying) video.addEventListener('canplay', () => video.play(), { once: true });
  applyVolume();
}

// Desktop right-click context menu
document.getElementById('desktop').addEventListener('contextmenu', (e) => {
  if (e.target.closest('.desktop-icon') || e.target.closest('.desktop-window')) return;
  e.preventDefault();
  const menu = document.getElementById('desktop-contextmenu');
  menu.style.left = e.clientX + 'px';
  menu.style.top = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 34) + 'px';
  menu.classList.remove('hidden', 'popup-in');
  void menu.offsetWidth;
  menu.classList.add('popup-in');
  onSelfAnimEnd(menu, () => menu.classList.remove('popup-in'));
  menu.querySelectorAll('.menu-item, [onclick]').forEach((item, i) => {
    item.classList.remove('ctx-item-anim');
    void item.offsetWidth;
    item.style.animationDelay = (i * 0.04) + 's';
    item.classList.add('ctx-item-anim');
    onSelfAnimEnd(item, () => { item.classList.remove('ctx-item-anim'); item.style.animationDelay = ''; });
  });
});

document.addEventListener('click', () => hideContextMenu());
document.addEventListener('contextmenu', (e) => {
  if (!e.target.closest('#desktop-contextmenu')) hideContextMenu();
});

function hideContextMenu() {
  document.getElementById('desktop-contextmenu').classList.add('hidden');
}

// Background picker
let pendingBgColor = '#008080';
let pendingBgImage = null;
let pendingBgSize = null;

function selectBg(el, color, image, bgImage, bgSize) {
  pendingBgColor = color;
  pendingBgImage = bgImage || image || null;
  pendingBgSize = bgSize || null;
  document.querySelectorAll('.bg-swatch').forEach(s => s.style.outline = '');
  el.style.outline = '2px solid #000080';
  el.classList.remove('swatch-pop');
  void el.offsetWidth;
  el.classList.add('swatch-pop');
  onSelfAnimEnd(el, () => el.classList.remove('swatch-pop'));
  const preview = document.getElementById('bg-preview');
  preview.style.background = color;
  preview.style.backgroundImage = pendingBgImage || '';
  if (pendingBgSize) preview.style.backgroundSize = pendingBgSize;
}

function applyDesktopBg() {
  desktop.style.backgroundColor = pendingBgColor;
  desktop.style.backgroundImage = pendingBgImage || '';
  desktop.style.backgroundSize = pendingBgSize || '';
  closeWindow('window-display');
}

// Download with license agreement
let pendingDownloadSrc = null, pendingDownloadName = null;

function confirmDownload(src, filename) {
  pendingDownloadSrc = src;
  pendingDownloadName = filename;
  const modal = document.getElementById('modal-license');
  modal.style.display = 'flex';
  const win = modal.querySelector('.window');
  if (win) {
    win.classList.remove('modal-bounce');
    void win.offsetWidth;
    win.classList.add('modal-bounce');
    onSelfAnimEnd(win, () => win.classList.remove('modal-bounce'));
  }
}

function proceedDownload() {
  if (pendingDownloadSrc) {
    const a = document.createElement('a');
    a.href = pendingDownloadSrc;
    a.download = pendingDownloadName || pendingDownloadSrc.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  cancelDownload();
}

function cancelDownload() {
  pendingDownloadSrc = null;
  pendingDownloadName = null;
  document.getElementById('modal-license').style.display = 'none';
}

document.querySelectorAll('audio, video').forEach(media => {
  media.addEventListener('timeupdate', () => updateMediaTime(media.id));
  if (media.readyState >= 1) {
    const slider = document.getElementById(`slider-${media.id}`);
    if (slider) slider.max = media.duration;
    updateMediaTime(media.id);
  } else {
    media.addEventListener('loadedmetadata', () => {
      const slider = document.getElementById(`slider-${media.id}`);
      if (slider) slider.max = media.duration;
      updateMediaTime(media.id);
    });
  }
});

let nowPlayingWindowId = null;

function updateNowPlayingTicker(text, windowId) {
  const container = document.getElementById('now-playing-container');
  const textEl = document.getElementById('now-playing-text');
  if (container && textEl) {
    if (text) {
      nowPlayingWindowId = windowId || null;
      textEl.innerText = text + "  ***  " + text;
      textEl.classList.remove('marquee');
      void textEl.offsetWidth;
      textEl.classList.add('marquee');
      container.style.display = 'flex';
      container.style.cursor = 'pointer';
      container.classList.remove('np-entering');
      void container.offsetWidth;
      container.classList.add('np-entering');
      setTimeout(() => container.classList.remove('np-entering'), 300);
    } else {
      nowPlayingWindowId = null;
      container.style.display = 'none';
      container.style.cursor = 'default';
      textEl.innerText = '';
      textEl.classList.remove('marquee');
    }
  }
}

function focusNowPlayingWindow() {
  if (!nowPlayingWindowId) return;
  const win = document.getElementById(nowPlayingWindowId);
  if (!win) return;
  if (win.classList.contains('hidden') || win.classList.contains('minimized')) {
    openWindow(nowPlayingWindowId);
  } else {
    bringToFront(nowPlayingWindowId);
  }
}

document.querySelectorAll('audio, video').forEach(el => {
  el.addEventListener('play', () => {
    let title = '';
    let winId = null;
    const titleEl = el.closest('.win95-media-player')?.querySelector('.media-title');
    if (titleEl) {
      title = titleEl.innerText.replace(/^\s*📌 Pin by @diedfavorite\s*/i, '').trim();
      if (el.closest('#window-beats')) winId = 'window-beats';
      else if (el.closest('#window-loops')) winId = 'window-loops';
    } else if (el.id === 'video-main') {
      title = document.getElementById('video-status')?.innerText || 'video';
      winId = 'window-video';
    }
    updateNowPlayingTicker(title, winId);
  });
  el.addEventListener('pause', () => {
    let anyPlaying = false;
    document.querySelectorAll('audio, video').forEach(media => {
       if (!media.paused && media !== el) anyPlaying = true;
    });
    if (!anyPlaying) updateNowPlayingTicker(null);
  });
});

/* ══════════════════════════════════════════
   WIN95 BOOT SCREEN SEQUENCE
══════════════════════════════════════════ */
(function runBoot() {
  const screen = document.getElementById('boot-screen');
  const bar    = document.getElementById('boot-bar');
  const msg    = document.getElementById('boot-msg');
  const sub    = document.getElementById('boot-sub');
  if (!screen) return;

  // Prevent interaction during boot
  document.body.classList.add('cursor-wait');

  const steps = [
    { pct: 12,  msg: 'Starting Windows 95...',        sub: 'Loading HIMEM.SYS...',          delay: 300 },
    { pct: 28,  msg: 'Starting Windows 95...',        sub: 'Loading device drivers...',      delay: 420 },
    { pct: 45,  msg: 'Starting Windows 95...',        sub: 'Initializing display adapter...', delay: 380 },
    { pct: 60,  msg: 'Starting Windows 95...',        sub: 'Loading @diedfavorite...',        delay: 500 },
    { pct: 78,  msg: 'Windows 95 is starting...',     sub: 'Setting up desktop...',           delay: 350 },
    { pct: 92,  msg: 'Windows 95 is starting...',     sub: 'Starting taskbar...',             delay: 280 },
    { pct: 100, msg: 'Loading complete.',              sub: 'Welcome to @diedfavorite',        delay: 400 },
  ];

  let i = 0;
  function nextStep() {
    if (i >= steps.length) {
      // Done — fade out boot screen
      setTimeout(() => {
        screen.classList.add('boot-fadeout');
        setTimeout(() => {
          screen.style.display = 'none';
          document.body.classList.remove('cursor-wait');
          // Staggered desktop icon entrance after boot
          document.querySelectorAll('.desktop-icon').forEach((icon, i) => {
            icon.style.opacity = '0';
            setTimeout(() => {
              icon.style.opacity = '';
              icon.classList.remove('icon-enter');
              void icon.offsetWidth;
              icon.classList.add('icon-enter');
              onSelfAnimEnd(icon, () => icon.classList.remove('icon-enter'));
            }, i * 70 + 80);
          });
          // Show balloon tip after boot
          setTimeout(() => showBalloon(isMobile() ? 'Welcome! Tap any icon to open a window.' : 'Welcome! Double-click any desktop icon to open a window.', 5000), 600);
        }, 620);
      }, 300);
      return;
    }
    const step = steps[i++];
    bar.style.width = step.pct + '%';
    msg.innerText   = step.msg;
    sub.innerText   = step.sub;
    setTimeout(nextStep, step.delay);
  }
  // Small initial delay so page can render
  setTimeout(nextStep, 200);
})();

/* ══════════════════════════════════════════
   WIN95 SHUTDOWN SEQUENCE
══════════════════════════════════════════ */
function shutDown() {
  closeStartMenu();

  // Fade out all playing audio/video over 500ms
  const mediaEls = Array.from(document.querySelectorAll('audio, video')).filter(m => !m.paused);
  if (mediaEls.length) {
    const startVols = mediaEls.map(m => m.volume);
    const steps = 25;
    let tick = 0;
    const fadeInterval = setInterval(() => {
      tick++;
      mediaEls.forEach((m, i) => {
        m.volume = Math.max(0, startVols[i] * (1 - tick / steps));
      });
      if (tick >= steps) {
        clearInterval(fadeInterval);
        mediaEls.forEach(m => m.pause());
      }
    }, 500 / steps);
  }

  setTimeout(() => {
    // Step 1: fade desktop + taskbar to black
    document.getElementById('desktop')?.classList.add('desktop-shutdown-fade');
    document.getElementById('taskbar')?.classList.add('desktop-shutdown-fade');

    setTimeout(() => {
      const screen  = document.getElementById('shutdown-screen');
      const crtWrap = document.getElementById('sd-crt-wrap');
      const p1      = document.getElementById('shutdown-p1');
      const p2      = document.getElementById('shutdown-p2');
      const bar     = document.getElementById('shutdown-bar');
      const msg     = document.getElementById('shutdown-msg');
      const sub     = document.getElementById('shutdown-sub');
      if (!screen) return;

      // Step 2: show shutdown screen, animate dialog in
      screen.style.display = 'block';
      p1.classList.add('sd-dialog-in');

      const steps = [
        { pct: 12,  msg: 'Saving your settings...',      sub: 'Writing profile data...',         delay: 600 },
        { pct: 30,  msg: 'Windows is shutting down...',  sub: 'Closing applications...',         delay: 520 },
        { pct: 50,  msg: 'Windows is shutting down...',  sub: 'Stopping background services...', delay: 460 },
        { pct: 68,  msg: 'Windows is shutting down...',  sub: 'Saving disk cache...',            delay: 420 },
        { pct: 84,  msg: 'Windows is shutting down...',  sub: 'Flushing write buffers...',       delay: 380 },
        { pct: 100, msg: 'Please wait...',               sub: '',                                delay: 550 },
      ];

      let si = 0;
      function nextStep() {
        if (si >= steps.length) {
          // Step 3: brief pause at 100%, then CRT collapse
          setTimeout(() => {
            crtWrap.classList.add('crt-off');
            // Step 4: after CRT collapses, reveal phase 2 on black
            setTimeout(() => {
              crtWrap.style.display = 'none';
              p2.style.display = 'flex';
              p2.classList.add('sd-p2-in');
              screen.addEventListener('click', () => location.reload(), { once: true });
            }, 750);
          }, 500);
          return;
        }
        const step = steps[si++];
        // Animate message change with a brief flash
        msg.classList.remove('sd-msg-flash');
        void msg.offsetWidth;
        msg.classList.add('sd-msg-flash');
        msg.innerText = step.msg;
        sub.innerText = step.sub;
        bar.style.width = step.pct + '%';
        setTimeout(nextStep, step.delay);
      }
      nextStep();
    }, 480);
  }, 220);
}

/* ══════════════════════════════════════════
   WIN95 BALLOON TOOLTIP SYSTEM
══════════════════════════════════════════ */
let balloonTimer = null;

// IE toolbar refresh button animation
function ieRefresh(btn) {
  btn.classList.remove('ie-refreshing');
  void btn.offsetWidth;
  btn.classList.add('ie-refreshing');
  onSelfAnimEnd(btn, () => btn.classList.remove('ie-refreshing'));
}

function showBalloon(text, duration = 4000) {
  const tip  = document.getElementById('balloon-tip');
  const textEl = document.getElementById('balloon-text');
  if (!tip || !textEl) return;

  // Position above the clock tray area
  const tray = document.getElementById('tray');
  if (tray) {
    const rect = tray.getBoundingClientRect();
    tip.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
    tip.style.right  = '8px';
  }

  textEl.innerText = text;
  tip.classList.remove('balloon-hiding');
  tip.style.display = 'block';

  if (balloonTimer) clearTimeout(balloonTimer);
  balloonTimer = setTimeout(() => {
    tip.classList.add('balloon-hiding');
    onSelfAnimEnd(tip, () => {
      tip.style.display = 'none';
      tip.classList.remove('balloon-hiding');
    });
  }, duration);
}

// Show balloon when a track starts playing
document.querySelectorAll('audio, video').forEach(el => {
  el.addEventListener('play', () => {
    const titleEl = el.closest('.win95-media-player')?.querySelector('.media-title');
    const label   = titleEl ? titleEl.innerText : (document.getElementById('video-status')?.innerText || '');
    if (label) showBalloon('♪ Now Playing: ' + label, 3500);
  });
});

/* ══════════════════════════════════════════
   BSOD EASTER EGG — Konami Code
══════════════════════════════════════════ */
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
let konamiIdx = 0;

document.addEventListener('keydown', (e) => {
  // Dismiss BSOD on any key
  const bsod = document.getElementById('bsod');
  if (bsod && bsod.style.display === 'flex') {
    bsod.style.display = 'none';
    return;
  }
  // Konami code check
  if (e.keyCode === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      triggerBSOD();
    }
  } else {
    konamiIdx = 0;
  }
});

function triggerBSOD() {
  const bsod = document.getElementById('bsod');
  if (!bsod) return;
  bsod.style.display = 'flex';
}

/* ══════════════════════════════════════════
   WINDOW DRAG — Ghost outline class
══════════════════════════════════════════ */
// Add ghost class during drag for title bar effect
const _origTitleMousedown = document.querySelectorAll;
document.querySelectorAll('.draggable').forEach(win => {
  const tb = win.querySelector('.title-bar');
  if (!tb) return;
  tb.addEventListener('mousedown', () => {
    win.classList.add('dragging-ghost');
  });
});
document.addEventListener('mouseup', () => {
  document.querySelectorAll('.dragging-ghost').forEach(w => w.classList.remove('dragging-ghost'));
});

/* ══════════════════════════════════════════
   MOBILE — Touch drag for windows
══════════════════════════════════════════ */
document.querySelectorAll('.draggable').forEach(windowEl => {
  const titleBar = windowEl.querySelector('.title-bar');
  if (!titleBar) return;

  let touchDragActive = false;
  let touchOffX = 0, touchOffY = 0;

  titleBar.addEventListener('touchstart', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    if (windowEl.classList.contains('maximized')) return;
    const t = e.touches[0];
    const rect = windowEl.getBoundingClientRect();
    touchOffX = t.clientX - rect.left;
    touchOffY = t.clientY - rect.top;
    touchDragActive = true;
    bringToFront(windowEl.id);
    // Removed e.preventDefault() to allow the 'click' event to reach buttons
  }, { passive: true });

  titleBar.addEventListener('touchmove', (e) => {
    if (!touchDragActive) return;
    const t = e.touches[0];
    const newLeft = Math.max(0, Math.min(t.clientX - touchOffX, window.innerWidth - 60));
    const newTop  = Math.max(0, Math.min(t.clientY - touchOffY, window.innerHeight - 60));
    windowEl.style.left = newLeft + 'px';
    windowEl.style.top  = newTop  + 'px';
    if (e.cancelable) e.preventDefault();
  }, { passive: false });


  titleBar.addEventListener('touchend', () => {
    touchDragActive = false;
  });
});

/* ══════════════════════════════════════════
   MOBILE — Double-tap to open desktop icons
══════════════════════════════════════════ */
(function setupDoubleTap() {
  const TAP_DELAY = 350;
  let lastTap = 0;
  let lastTarget = null;

  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('touchend', (e) => {
      const now = Date.now();
      const target = icon;
      if (now - lastTap < TAP_DELAY && lastTarget === target) {
        // Double-tap — fire ondblclick
        const dblEv = new MouseEvent('dblclick', { bubbles: true, cancelable: true });
        target.dispatchEvent(dblEv);
        lastTap = 0;
        lastTarget = null;
      } else {
        lastTap = now;
        lastTarget = target;
        // Single tap — select
        const clickEv = new MouseEvent('click', { bubbles: true, cancelable: true });
        target.dispatchEvent(clickEv);
      }
      e.preventDefault();
    });
  });
})();

/* ══════════════════════════════════════════
   BOOT SCREEN — #2011nostalgia color cycle
══════════════════════════════════════════ */
(function animateBootTag() {
  const tag = document.getElementById('boot-tag');
  if (!tag) return;
  const colors = ['#0000ff', '#4444ff', '#0000cc', '#000080', '#3333aa', '#0000ff'];
  let ci = 0;
  const iv = setInterval(() => {
    if (!document.getElementById('boot-screen') ||
        document.getElementById('boot-screen').style.display === 'none') {
      clearInterval(iv); return;
    }
    tag.style.color = colors[ci % colors.length];
    ci++;
  }, 300);
})();


/* ══════════════════════════════════════════
   TASKBAR — Show Desktop button
══════════════════════════════════════════ */
function showDesktop() {
  let anyVisible = false;
  openWindows.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) anyVisible = true;
  });
  if (anyVisible) {
    // Minimize all visible windows
    openWindows.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.classList.contains('hidden')) minimizeWindow(id);
    });
    showBalloon('Desktop shown — click a taskbar button to restore.', 2500);
  } else {
    // Restore all windows
    openWindows.forEach(id => openWindow(id));
  }
}

/* ══════════════════════════════════════════
   START BUTTON — entrance bounce on load
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  const btn = document.getElementById('start-btn');
  if (!btn) return;
  // Wait for boot screen to finish then bounce
  setTimeout(() => {
    btn.classList.add('taskbar-press');
    onSelfAnimEnd(btn, () => btn.classList.remove('taskbar-press'));
  }, 3200); // after boot completes
});

/* ══════════════════════════════════════════
   TRAY — Language Indicator
   Uses Intl API (system/OS locale) as primary
   source so it reflects the actual device
   language, not just the browser UI language.
══════════════════════════════════════════ */
const LANG_MAP = [
  { match: ['zh-tw', 'zh-hk', 'zh-mo'], code: '中',  full: 'Chinese (Traditional)' },
  { match: ['zh-cn', 'zh-sg', 'zh'],    code: '中',  full: 'Chinese (Simplified)'  },
  { match: ['ja'],                       code: '日',  full: 'Japanese'               },
  { match: ['ko'],                       code: '한',  full: 'Korean'                 },
  { match: ['fr'],                       code: 'FR', full: 'French'                 },
  { match: ['de'],                       code: 'DE', full: 'German'                 },
  { match: ['es'],                       code: 'ES', full: 'Spanish'                },
  { match: ['pt'],                       code: 'PT', full: 'Portuguese'             },
  { match: ['ru'],                       code: 'RU', full: 'Russian'                },
  { match: ['ar'],                       code: 'AR', full: 'Arabic'                 },
  { match: ['th'],                       code: 'TH', full: 'Thai'                   },
  { match: ['vi'],                       code: 'VI', full: 'Vietnamese'             },
  { match: ['en'],                       code: 'EN', full: 'English'                },
];

let _currentLangFull = 'English';

function detectLang(tag) {
  if (!tag) return { code: 'EN', full: 'English' };
  const lower = tag.toLowerCase();
  for (const entry of LANG_MAP) {
    if (entry.match.some(m => lower === m || lower.startsWith(m + '-'))) {
      return { code: entry.code, full: entry.full };
    }
  }
  return { code: tag.split('-')[0].toUpperCase().slice(0, 2), full: tag };
}

function getBestLocale() {
  // Priority 1: Intl resolved locale (closest to OS/system language)
  try {
    const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (intlLocale) return intlLocale;
  } catch(e) {}
  // Priority 2: First from navigator.languages array
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  }
  // Priority 3: navigator.language fallback
  return navigator.language || 'en';
}

function applyLang(tag) {
  const { code, full } = detectLang(tag);
  _currentLangFull = full;
  const indicator = document.getElementById('lang-indicator');
  const tray      = document.getElementById('lang-tray');
  if (indicator) indicator.textContent = code;
  if (tray)      tray.title = 'Language: ' + full;
}

function showLangBalloon() {
  showBalloon('⌨ Language: ' + _currentLangFull, 3000);
}

// Apply on load
applyLang(getBestLocale());

// Re-apply if browser language changes
window.addEventListener('languagechange', () => {
  applyLang(getBestLocale());
  showBalloon('⌨ Language: ' + _currentLangFull, 2500);
});
// Universal orientation change handler
window.addEventListener('orientationchange', () => {
  hideContextMenu();
  closeStartMenu();
  document.getElementById('volume-popup')?.classList.add('hidden');
  
  // Re-calculate window positions if they go off-screen
  setTimeout(() => {
    openWindows.forEach(id => {
      const el = document.getElementById(id);
      if (!el || el.classList.contains('hidden')) return;
      const rect = el.getBoundingClientRect();
      if (rect.left > window.innerWidth - 40) el.style.left = (window.innerWidth - 300) + 'px';
      if (rect.top > window.innerHeight - 40) el.style.top = '20px';
    });
  }, 300);
});

// Also listen to resize for Android Chrome support
window.addEventListener('resize', () => {
  if (window.innerWidth > window.innerHeight && isMobile()) {
     hideContextMenu();
  }
  checkRotationNotice();
});

// Safety net: Force show/hide rotate notice based on orientation on mobile
function checkRotationNotice() {
  const notice = document.getElementById('rotate-notice');
  if (!notice) return;
  
  // If portrait and small screen, ensure it's visible if CSS missed it
  if (window.innerHeight > window.innerWidth && window.innerWidth < 1000) {
    if (isMobile()) {
      notice.style.display = 'flex';
      // Hide other core UI just in case
      document.getElementById('desktop').style.display = 'none';
      document.getElementById('taskbar').style.display = 'none';
    }
  } else {
    // Landscape or desktop - reset styles to let CSS take over or show UI
    notice.style.display = '';
    document.getElementById('desktop').style.display = '';
    document.getElementById('taskbar').style.display = '';
  }
}

// Run on boot
setTimeout(checkRotationNotice, 500);

