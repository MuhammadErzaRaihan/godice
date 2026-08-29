import './bootstrap';
import { switchTheme } from './theme-manager.js';
import { 
    state, ALL_COLORS, COLOR_MAP, triggerRoll, executeRoll, adjustCounter, 
    toggleAntiBan, updateDiceCount, renderVerifyView, renderGameId, getRandomColor 
} from './dice-engine.js';
import { renderStreamers, renderAdminStreamerList, removeStreamer, addVerifiedStreamer } from './streamer-manager.js';

// Bind to Window for inline HTML events
window.switchTheme = switchTheme;
window.triggerRoll = triggerRoll;
window.adjustCounter = adjustCounter;
window.toggleAntiBan = toggleAntiBan;
window.updateDiceCount = updateDiceCount;
window.refreshVerification = renderVerifyView;
window.removeStreamer = removeStreamer;
window.addVerifiedStreamer = addVerifiedStreamer;

window.switchView = function(viewName) {
    const mainView = document.getElementById('view-main');
    const verifyView = document.getElementById('view-verify');
    const adminView = document.getElementById('view-admin');

    const navMain = document.getElementById('nav-btn-main');
    const navVerify = document.getElementById('nav-btn-verify');
    const navAdmin = document.getElementById('nav-btn-admin');

    if (mainView) mainView.classList.add('hidden');
    if (verifyView) verifyView.classList.add('hidden');
    if (adminView) adminView.classList.add('hidden');

    if (navMain) navMain.className = 'px-3 py-1.5 rounded-lg text-red-100 hover:bg-red-800/60 transition';
    if (navVerify) navVerify.className = 'px-3 py-1.5 rounded-lg text-red-100 hover:bg-red-800/60 transition';
    if (navAdmin) navAdmin.className = 'px-3 py-1.5 rounded-lg text-yellow-300 hover:bg-red-800/80 transition border border-yellow-500/30 flex items-center gap-1.5';

    if (viewName === 'main' && mainView) {
        mainView.classList.remove('hidden');
        document.body.className = 'min-h-screen text-white flex flex-col justify-between';
        document.body.setAttribute('data-theme', state.theme || 'arcade');
        if (navMain) navMain.className = 'px-3 py-1.5 rounded-lg bg-yellow-400 text-red-950 font-bold shadow transition';
    } else if (viewName === 'verify' && verifyView) {
        verifyView.classList.remove('hidden');
        document.body.className = 'bg-verify-theme min-h-screen text-white flex flex-col justify-between';
        if (navVerify) navVerify.className = 'px-3 py-1.5 rounded-lg bg-yellow-400 text-sky-950 font-bold shadow transition';
        renderVerifyView();
    } else if (viewName === 'admin' && adminView) {
        adminView.classList.remove('hidden');
        document.body.className = 'bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 min-h-screen text-white flex flex-col justify-between';
        if (navAdmin) navAdmin.className = 'px-3 py-1.5 rounded-lg bg-yellow-400 text-purple-950 font-bold shadow transition flex items-center gap-1.5';
        renderAdminPage();
    }
};

window.toggleLast20Panel = function() {
    const panel = document.getElementById('panel-last-20');
    if (panel) panel.classList.toggle('hidden');
};

window.toggleExcludeColor = function(color) {
    if (state.excludedColors.includes(color)) {
        state.excludedColors = state.excludedColors.filter(c => c !== color);
    } else {
        state.excludedColors.push(color);
    }
    renderAdminToggles();
};

window.applyRigPreset = function(preset) {
    if (preset === 'clean') state.excludedColors = [];
    else if (preset === 'no-red-blue') state.excludedColors = ['Red', 'Blue'];
    else if (preset === 'only-yellow') state.excludedColors = ['Red', 'Orange', 'Green', 'Blue', 'Purple'];
    renderAdminToggles();
};

window.testAdminRoll = function() {
    const outcomeContainer = document.getElementById('admin-test-roll-result');
    if (!outcomeContainer) return;
    outcomeContainer.innerHTML = '';

    for (let i = 0; i < state.diceCount; i++) {
        const color = getRandomColor();
        const cfg = COLOR_MAP[color];
        const badge = document.createElement('div');
        badge.className = 'px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 border border-white/20 shadow';
        badge.style.backgroundColor = cfg.bg;
        badge.innerHTML = `<div class="w-2 h-2 rounded-full bg-white"></div> ${color}`;
        outcomeContainer.appendChild(badge);
    }
};

function renderAdminPage() {
    renderAdminToggles();
    renderAdminStreamerList();
    renderGameId();
}

function renderAdminToggles() {
    const container = document.getElementById('admin-color-toggles');
    const statusBadge = document.getElementById('rig-status-badge');
    if (!container) return;

    container.innerHTML = '';
    ALL_COLORS.forEach(color => {
        const isExcluded = state.excludedColors.includes(color);
        const btn = document.createElement('button');
        btn.className = `p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition ${
            isExcluded 
                ? 'bg-red-950/80 border-red-600 text-red-300 shadow-inner' 
                : 'bg-slate-800 hover:bg-slate-700 border-purple-600/60 text-white'
        }`;
        btn.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${COLOR_MAP[color].bg}"></span>
                <span>${color}</span>
            </div>
            <i class="fa-solid ${isExcluded ? 'fa-ban text-red-400 text-sm' : 'fa-check text-emerald-400 text-xs'}"></i>
        `;
        btn.onclick = () => window.toggleExcludeColor(color);
        container.appendChild(btn);
    });

    if (statusBadge) {
        if (state.excludedColors.length > 0) {
            statusBadge.innerText = `RIG ACTIVE (${state.excludedColors.length} EXCLUDED)`;
            statusBadge.className = 'text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-600 animate-pulse';
        } else {
            statusBadge.innerText = 'FAIR / CLEAN ROLL';
            statusBadge.className = 'text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600';
        }
    }
}

// Global User Count Fluctuation Simulation
setInterval(() => {
    const delta = Math.floor(Math.random() * 7) - 3;
    state.usersOnline = Math.max(500, state.usersOnline + delta);
    const userEl = document.getElementById('users-online-count');
    if (userEl) userEl.innerText = state.usersOnline;
}, 4000);

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    switchTheme('arcade');
    renderStreamers();
    executeRoll();
});

document.addEventListener('DOMContentLoaded', () => {
    // Jika berada di rute Admin Panel, gunakan tema statis Cyberpunk
    if (window.location.pathname.includes('admin-panel')) {
        document.body.className = 'admin-cyberpunk min-h-screen text-white flex flex-col justify-between';
        document.body.removeAttribute('data-theme');
        renderAdminPage();
    } else if (window.location.pathname.includes('verify')) {
        document.body.className = 'bg-verify-theme min-h-screen text-white flex flex-col justify-between';
        renderVerifyView();
    } else {
        switchTheme('arcade');
        renderStreamers();
        executeRoll();
    }
});