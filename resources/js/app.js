import './bootstrap';
import { switchTheme } from './theme-manager.js';
import { 
    state, ALL_COLORS, COLOR_MAP, triggerRoll, adjustCounter, 
    toggleAntiBan, updateDiceCount, renderVerifyView, renderGameId, getRandomColor, fetchRollHistory 
} from './dice-engine.js';
import { renderStreamers, renderAdminStreamerList, deleteStreamer, addVerifiedStreamer, loadStreamers } from './streamer-manager.js';

// Global Event Binding
window.switchTheme = switchTheme;
window.triggerRoll = triggerRoll;
window.adjustCounter = adjustCounter;
window.toggleAntiBan = toggleAntiBan;
window.updateDiceCount = updateDiceCount;
window.refreshVerification = renderVerifyView;
window.deleteStreamer = deleteStreamer;
window.addVerifiedStreamer = addVerifiedStreamer;

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

// Single Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    loadStreamers();
    fetchRollHistory();

    if (window.location.pathname.includes('admin-panel')) {
        document.body.className = 'admin-cyberpunk min-h-screen text-white flex flex-col justify-between';
        document.body.removeAttribute('data-theme');
        renderAdminPage();
    } else if (window.location.pathname.includes('verify')) {
        document.body.className = 'bg-verify-theme min-h-screen text-white flex flex-col justify-between';
        renderVerifyView();
    } else {
        switchTheme('arcade');
        triggerRoll(); // Eksekusi awal melempar dadu dari DB
    }
});

/**
 * Simpan aturan pendaran/blokir warna ke Database via API
 */
async function syncRigToBackend(excludedColors) {
    try {
        await fetch('/api/admin/rig', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({ excluded_colors: excludedColors })
        });
    } catch (error) {
        console.error('Gagal menyimpan aturan rigging:', error);
    }
}

window.toggleExcludeColor = function(color) {
    if (state.excludedColors.includes(color)) {
        state.excludedColors = state.excludedColors.filter(c => c !== color);
    } else {
        state.excludedColors.push(color);
    }
    renderAdminToggles();
    syncRigToBackend(state.excludedColors); // Simpan ke MySQL
};

window.applyRigPreset = function(preset) {
    if (preset === 'clean') state.excludedColors = [];
    else if (preset === 'no-red-blue') state.excludedColors = ['Red', 'Blue'];
    else if (preset === 'only-yellow') state.excludedColors = ['Red', 'Orange', 'Green', 'Blue', 'Purple'];
    
    renderAdminToggles();
    syncRigToBackend(state.excludedColors); // Simpan ke MySQL
};