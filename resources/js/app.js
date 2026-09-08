import './bootstrap';
import { switchTheme } from './theme-manager.js';
import { 
    state, ALL_COLORS, COLOR_MAP, triggerRoll, adjustCounter, 
    toggleAntiBan, updateDiceCount, renderVerifyView, renderGameId, 
    getRandomColor, fetchRollHistory, renderMainDiceGrid, auditGameId 
} from './dice-engine.js';
import { 
    renderStreamers, renderAdminStreamerList, deleteStreamer, 
    addVerifiedStreamer, loadStreamers 
} from './streamer-manager.js';

let targetedExcludedColors = [];
let targetedForcedColors = [];
let targetDebounceTimer = null;

async function loadAdminRigSettings() {
    try {
        const response = await fetch('/api/admin/rig');
        if (!response.ok) return;

        const data = await response.json();
        if (data.success) {
            state.excludedColors = data.excluded_colors || [];
            state.forcedColors = data.forced_colors || [];
            renderAdminToggles();
        }
    } catch (error) {
        console.error('Gagal memuat aturan rigging global:', error);
    }
}

async function syncRigToBackend(excludedColors, forcedColors) {
    try {
        await fetch('/api/admin/rig', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({ 
                excluded_colors: excludedColors,
                forced_colors: forcedColors 
            })
        });
    } catch (error) {
        console.error('Gagal menyimpan aturan rigging global:', error);
    }
}

window.switchTheme = switchTheme;
window.triggerRoll = triggerRoll;
window.adjustCounter = adjustCounter;
window.toggleAntiBan = toggleAntiBan;
window.updateDiceCount = updateDiceCount;
window.refreshVerification = renderVerifyView;
window.deleteStreamer = deleteStreamer;
window.addVerifiedStreamer = addVerifiedStreamer;
window.auditGameId = auditGameId;

window.toggleLast20Panel = function() {
    const panel = document.getElementById('panel-last-20');
    if (panel) panel.classList.toggle('hidden');
};

window.toggleExcludeColor = function(color) {
    if (state.excludedColors.includes(color)) {
        state.excludedColors = state.excludedColors.filter(c => c !== color);
    } else {
        state.excludedColors.push(color);
        // Jika diblokir, otomatis hapus dari warna wajib
        state.forcedColors = state.forcedColors.filter(c => c !== color);
    }
    renderAdminToggles();
    syncRigToBackend(state.excludedColors, state.forcedColors);
};

window.toggleForcedColor = function(color) {
    if (state.forcedColors.includes(color)) {
        state.forcedColors = state.forcedColors.filter(c => c !== color);
    } else {
        state.forcedColors.push(color);
        // Jika diwajibkan, otomatis hapus dari warna blokir
        state.excludedColors = state.excludedColors.filter(c => c !== color);
    }
    renderAdminToggles();
    syncRigToBackend(state.excludedColors, state.forcedColors);
};

window.toggleTargetedExcludeColor = function(color) {
    if (targetedExcludedColors.includes(color)) {
        targetedExcludedColors = targetedExcludedColors.filter(c => c !== color);
    } else {
        targetedExcludedColors.push(color);
        targetedForcedColors = targetedForcedColors.filter(c => c !== color);
    }
    renderTargetedToggles();
};

window.toggleTargetedForcedColor = function(color) {
    if (targetedForcedColors.includes(color)) {
        targetedForcedColors = targetedForcedColors.filter(c => c !== color);
    } else {
        targetedForcedColors.push(color);
        targetedExcludedColors = targetedExcludedColors.filter(c => c !== color);
    }
    renderTargetedToggles();
};

window.applyRigPreset = function(preset) {
    if (preset === 'clean') {
        state.excludedColors = [];
        state.forcedColors = [];
    } else if (preset === 'no-red-blue') {
        state.excludedColors = ['Red', 'Blue'];
        state.forcedColors = [];
    } else if (preset === 'only-yellow') {
        state.excludedColors = ['Red', 'Orange', 'Green', 'Blue', 'Purple'];
        state.forcedColors = ['Yellow'];
    } else if (preset === 'block-3-guarantee-yellow') {
        state.excludedColors = ['Green', 'Blue', 'Purple'];
        state.forcedColors = ['Yellow'];
    }
    
    renderAdminToggles();
    syncRigToBackend(state.excludedColors, state.forcedColors);
};

window.applyTargetedRigPreset = function(preset) {
    if (preset === 'clean') {
        targetedExcludedColors = [];
        targetedForcedColors = [];
    } else if (preset === 'no-red-blue') {
        targetedExcludedColors = ['Red', 'Blue'];
        targetedForcedColors = [];
    } else if (preset === 'only-yellow') {
        targetedExcludedColors = ['Red', 'Orange', 'Green', 'Blue', 'Purple'];
        targetedForcedColors = ['Yellow'];
    } else if (preset === 'block-3-guarantee-yellow') {
        targetedExcludedColors = ['Green', 'Blue', 'Purple'];
        targetedForcedColors = ['Yellow'];
    }
    
    renderTargetedToggles();
};

window.loadTargetedPresetForGameId = async function(gameId) {
    if (!gameId) return;
    try {
        const response = await fetch(`/api/admin/preset-roll/${encodeURIComponent(gameId)}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                targetedExcludedColors = data.excluded_colors || [];
                targetedForcedColors = data.forced_colors || [];
                renderTargetedToggles();
            }
        }
    } catch (e) {
        console.error('Gagal memuat preset khusus Game ID:', e);
    }
};

window.fillActiveSessionId = function() {
    const input = document.getElementById('rig-target-game-id');
    if (input && state.currentGameId) {
        input.value = state.currentGameId;
        window.loadTargetedPresetForGameId(state.currentGameId);
    }
};

window.onTargetGameIdChange = function(val) {
    clearTimeout(targetDebounceTimer);
    targetDebounceTimer = setTimeout(() => {
        const gameId = val.trim();
        if (gameId) {
            window.loadTargetedPresetForGameId(gameId);
        } else {
            targetedExcludedColors = [];
            targetedForcedColors = [];
            renderTargetedToggles();
        }
    }, 300);
};

window.saveTargetedColorRig = async function() {
    const gameIdInput = document.getElementById('rig-target-game-id');
    const gameId = gameIdInput?.value.trim();

    if (!gameId) {
        alert('Masukkan Target Game ID terlebih dahulu!');
        return;
    }

    try {
        const response = await fetch('/api/admin/preset-roll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                game_id: gameId,
                excluded_colors: targetedExcludedColors,
                forced_colors: targetedForcedColors
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            alert(data.message || `Berhasil menyimpan aturan untuk Game ID "${gameId}".`);
            renderTargetedToggles();
        } else {
            const errorMsg = data.errors ? Object.values(data.errors).flat().join('\n') : (data.message || 'Gagal menyimpan aturan.');
            alert(errorMsg);
        }
    } catch (error) {
        console.error('Error saving targeted rig:', error);
        alert('Terjadi kesalahan koneksi.');
    }
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
    
    const targetInput = document.getElementById('rig-target-game-id');
    if (targetInput && state.currentGameId && !targetInput.value) {
        targetInput.value = state.currentGameId;
        window.loadTargetedPresetForGameId(state.currentGameId);
    } else {
        renderTargetedToggles();
    }

    renderAdminStreamerList();
    renderGameId();
}

function renderAdminToggles() {
    const containerExcluded = document.getElementById('admin-color-toggles');
    const containerForced = document.getElementById('admin-forced-color-toggles');
    const statusBadge = document.getElementById('rig-status-badge');

    if (containerExcluded) {
        containerExcluded.innerHTML = '';
        ALL_COLORS.forEach(color => {
            const isExcluded = state.excludedColors.includes(color);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `p-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition cursor-pointer ${
                isExcluded 
                    ? 'bg-rose-950/90 border-rose-600 text-rose-300 shadow-inner' 
                    : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-600/60 text-white'
            }`;
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full shrink-0 border border-white/20" style="background-color: ${COLOR_MAP[color].bg}"></span>
                    <span>${color}</span>
                </div>
                <i class="fa-solid ${isExcluded ? 'fa-ban text-rose-400 text-sm' : 'fa-check text-emerald-400/40 text-xs'}"></i>
            `;
            btn.onclick = () => window.toggleExcludeColor(color);
            containerExcluded.appendChild(btn);
        });
    }

    if (containerForced) {
        containerForced.innerHTML = '';
        ALL_COLORS.forEach(color => {
            const isForced = state.forcedColors.includes(color);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `p-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition cursor-pointer ${
                isForced 
                    ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-inner' 
                    : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-600/60 text-white'
            }`;
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full shrink-0 border border-white/20" style="background-color: ${COLOR_MAP[color].bg}"></span>
                    <span>${color}</span>
                </div>
                <i class="fa-solid ${isForced ? 'fa-star text-amber-400 text-sm' : 'fa-plus text-slate-400/40 text-xs'}"></i>
            `;
            btn.onclick = () => window.toggleForcedColor(color);
            containerForced.appendChild(btn);
        });
    }

    if (statusBadge) {
        if (state.excludedColors.length > 0 || state.forcedColors.length > 0) {
            statusBadge.innerText = `RIG ACTIVE (${state.excludedColors.length} BLOCKED | ${state.forcedColors.length} GUARANTEED)`;
            statusBadge.className = 'text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-600 animate-pulse';
        } else {
            statusBadge.innerText = 'FAIR / CLEAN ROLL';
            statusBadge.className = 'text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600';
        }
    }
}

function renderTargetedToggles() {
    const containerExcluded = document.getElementById('targeted-color-toggles');
    const containerForced = document.getElementById('targeted-forced-color-toggles');
    const statusBadge = document.getElementById('targeted-rig-status-badge');

    if (containerExcluded) {
        containerExcluded.innerHTML = '';
        ALL_COLORS.forEach(color => {
            const isExcluded = targetedExcludedColors.includes(color);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `p-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition cursor-pointer ${
                isExcluded 
                    ? 'bg-rose-950/90 border-rose-600 text-rose-300 shadow-inner' 
                    : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-600/60 text-white'
            }`;
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full shrink-0 border border-white/20" style="background-color: ${COLOR_MAP[color].bg}"></span>
                    <span>${color}</span>
                </div>
                <i class="fa-solid ${isExcluded ? 'fa-ban text-rose-400 text-sm' : 'fa-check text-emerald-400/40 text-xs'}"></i>
            `;
            btn.onclick = () => window.toggleTargetedExcludeColor(color);
            containerExcluded.appendChild(btn);
        });
    }

    if (containerForced) {
        containerForced.innerHTML = '';
        ALL_COLORS.forEach(color => {
            const isForced = targetedForcedColors.includes(color);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `p-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition cursor-pointer ${
                isForced 
                    ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-inner' 
                    : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-600/60 text-white'
            }`;
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full shrink-0 border border-white/20" style="background-color: ${COLOR_MAP[color].bg}"></span>
                    <span>${color}</span>
                </div>
                <i class="fa-solid ${isForced ? 'fa-star text-amber-400 text-sm' : 'fa-plus text-slate-400/40 text-xs'}"></i>
            `;
            btn.onclick = () => window.toggleTargetedForcedColor(color);
            containerForced.appendChild(btn);
        });
    }

    if (statusBadge) {
        if (targetedExcludedColors.length > 0 || targetedForcedColors.length > 0) {
            statusBadge.innerText = `RIG (${targetedExcludedColors.length} BLOCKED | ${targetedForcedColors.length} GUARANTEED)`;
            statusBadge.className = 'text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-600 animate-pulse';
        } else {
            statusBadge.innerText = 'CLEAN ROLL';
            statusBadge.className = 'text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600';
        }
    }
}

setInterval(() => {
    const delta = Math.floor(Math.random() * 7) - 3;
    state.usersOnline = Math.max(500, state.usersOnline + delta);
    const userEl = document.getElementById('users-online-count');
    if (userEl) userEl.innerText = state.usersOnline;
}, 4000);

document.addEventListener('DOMContentLoaded', () => {
    loadStreamers();
    fetchRollHistory(true);

    const isSecretAdmin = window.location.pathname.includes('secret-admin') || window.location.pathname.includes('admin-panel');

    if (isSecretAdmin) {
        document.body.classList.add('admin-cyberpunk');
        document.body.removeAttribute('data-theme');
        loadAdminRigSettings();
        renderAdminPage();
    } else if (window.location.pathname.includes('verify')) {
        document.body.className = 'bg-verify-theme min-h-screen text-white flex flex-col justify-between';
        renderVerifyView();
    } else {
        switchTheme('minimal');
        renderMainDiceGrid();
        renderGameId();
    }
});