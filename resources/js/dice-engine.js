export const COLOR_MAP = {
    'Red':    { bg: '#fd0000', text: 'text-red-400', border: 'border-red-600' },
    'Orange': { bg: '#fe8127', text: 'text-orange-400', border: 'border-orange-600' },
    'Yellow': { bg: '#fed700', text: 'text-yellow-300', border: 'border-yellow-600' },
    'Green':  { bg: '#008001', text: 'text-green-400', border: 'border-green-600' },
    'Blue':   { bg: '#3b82f6', text: 'text-blue-400', border: 'border-blue-600' },
    'Purple': { bg: '#81007f', text: 'text-purple-400', border: 'border-purple-600' }
};

export const ALL_COLORS = Object.keys(COLOR_MAP);

export const state = {
    theme: 'arcade',
    diceCount: 4,
    currentRoll: [],
    currentGameId: generateGameId(),
    counter: 0,
    antiBan: false,
    excludedColors: [],
    history: [],
    usersOnline: 792,
    streamers: [
        { name: 'FREXX', handle: '@frexx100', verified: true, url: 'https://tiktok.com/@frexx100/live' },
        { name: 'MEETS GAMING', handle: '@jsonvy', verified: true, url: 'https://tiktok.com/@jsonvy/live' },
        { name: 'ODDDUCKS', handle: '@odducks', verified: true, url: 'https://tiktok.com/@odducks/live' },
        { name: 'LEE0', handle: '@lee0042', verified: true, url: 'https://tiktok.com/@lee0042/live' },
        { name: 'VEXY', handle: '@vextor1', verified: true, url: 'https://tiktok.com/@vextor1/live' },
        { name: 'CRONOS.EXE', handle: '@cronos_tab', verified: true, url: 'https://tiktok.com/@cronos_tab/live' },
        { name: 'KAZ', handle: '@kazuhko_mayuko', verified: true, url: 'https://tiktok.com/@kazuhko_mayuko/live' },
        { name: 'INTERLUDE', handle: '@interludefive', verified: true, url: 'https://tiktok.com/@interludefive/live' },
        { name: 'TODDY', handle: '@toddytopia', verified: true, url: 'https://tiktok.com/@toddytopia/live' }
    ]
};

export function generateGameId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function playRollSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
}

export function getAvailableColors() {
    const available = ALL_COLORS.filter(c => !state.excludedColors.includes(c));
    return available.length > 0 ? available : ALL_COLORS;
}

export function getRandomColor() {
    const pool = getAvailableColors();
    return pool[Math.floor(Math.random() * pool.length)];
}

export function triggerRoll() {
    playRollSound();
    const splash = document.getElementById('splash-overlay');
    const splashDiceGrid = document.getElementById('splash-dice-grid');
    
    if (splash && splashDiceGrid) {
        // Render dadu putih bergetar sesuai jumlah dadu aktif
        splashDiceGrid.innerHTML = '';
        for (let i = 0; i < state.diceCount; i++) {
            const box = document.createElement('div');
            box.className = 'w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-100 shadow-2xl animate-dice-tumble';
            box.style.animationDelay = `${(i * 0.08).toFixed(2)}s`;

            const dot = document.createElement('div');
            dot.className = 'w-5 h-5 bg-gray-200 rounded-full shadow-inner';
            
            box.appendChild(dot);
            splashDiceGrid.appendChild(box);
        }

        splash.classList.remove('hidden');

        setTimeout(() => {
            executeRoll();
            splash.classList.add('hidden');
        }, 550);
    } else {
        executeRoll();
    }
}

export function executeRoll() {
    const newDice = [];
    for (let i = 0; i < state.diceCount; i++) {
        newDice.push(getRandomColor());
    }

    state.currentRoll = newDice;
    state.currentGameId = generateGameId();

    state.history.unshift({
        id: state.currentGameId,
        timestamp: Date.now(),
        dice: [...newDice]
    });

    if (state.history.length > 50) state.history.pop();

    renderMainDiceGrid();
    renderGameId();
    renderLast20Panel();
    renderVerifyView();
}

export function renderMainDiceGrid() {
    const container = document.getElementById('dice-container');
    if (!container) return;
    container.innerHTML = '';

    state.currentRoll.forEach(color => {
        const colorConfig = COLOR_MAP[color] || COLOR_MAP['Red'];
        const box = document.createElement('div');
        box.className = `dice-box w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center border-2 border-white/20 transition-all transform`;
        box.style.backgroundColor = colorConfig.bg;

        const dot = document.createElement('div');
        dot.className = 'w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-inner';
        
        box.appendChild(dot);
        container.appendChild(box);
    });
}

export function renderGameId() {
    const elGameId = document.getElementById('current-game-id');
    const elVerifyId = document.getElementById('verify-game-id-input');
    const elAdminId = document.getElementById('admin-session-id');

    if (elGameId) elGameId.innerText = state.currentGameId;
    if (elVerifyId) elVerifyId.value = state.currentGameId;
    if (elAdminId) elAdminId.innerText = state.currentGameId;
}

export function adjustCounter(val) {
    state.counter += val;
    const counterEl = document.getElementById('manual-counter-value');
    if (counterEl) counterEl.innerText = state.counter;
}

export function toggleAntiBan(isActive) {
    state.antiBan = isActive;
    const container = document.getElementById('dice-container');
    const overlayLabel = document.getElementById('anti-ban-overlay-label');

    if (container) {
        if (isActive) container.classList.add('anti-ban-container');
        else container.classList.remove('anti-ban-container');
    }
    if (overlayLabel) {
        if (isActive) overlayLabel.classList.remove('hidden');
        else overlayLabel.classList.add('hidden');
    }
}

export function updateDiceCount(val) {
    state.diceCount = parseInt(val, 10);
    executeRoll();
}

export function renderLast20Panel() {
    const rolls = state.history.slice(0, 20);
    if (rolls.length === 0) return;

    const colorCounts = {};
    ALL_COLORS.forEach(c => colorCounts[c] = 0);

    rolls.forEach(r => {
        r.dice.forEach(c => {
            colorCounts[c] = (colorCounts[c] || 0) + 1;
        });
    });

    let dominantColor = 'Red';
    let maxCount = -1;
    Object.keys(colorCounts).forEach(c => {
        if (colorCounts[c] > maxCount) {
            maxCount = colorCounts[c];
            dominantColor = c;
        }
    });

    const streakEl = document.getElementById('roll-streak-display');
    if (streakEl) streakEl.innerText = `${maxCount} 🔥 (${dominantColor} dice)`;

    const statsContainer = document.getElementById('stats-color-breakdown');
    if (statsContainer) {
        statsContainer.innerHTML = '';
        ALL_COLORS.forEach(c => {
            const count = colorCounts[c];
            const cfg = COLOR_MAP[c];
            const badge = document.createElement('span');
            badge.className = `px-2 py-0.5 rounded text-[11px] font-bold ${cfg.text} bg-red-950 border border-red-800 flex items-center gap-1`;
            badge.innerHTML = `■ x${count}`;
            statsContainer.appendChild(badge);
        });
    }

    const longestStreakEl = document.getElementById('stats-longest-streak');
    if (longestStreakEl) longestStreakEl.innerText = `${dominantColor} x${maxCount} 🔥`;

    const currentContainer = document.getElementById('history-row-current');
    if (currentContainer) {
        currentContainer.innerHTML = '<span class="text-xs text-yellow-300 font-bold mr-2">1.</span>';
        rolls[0].dice.forEach(color => {
            const cfg = COLOR_MAP[color];
            const miniBox = document.createElement('div');
            miniBox.className = 'w-6 h-6 rounded-md flex items-center justify-center shrink-0 border border-white/20';
            miniBox.style.backgroundColor = cfg.bg;
            miniBox.innerHTML = '<div class="w-1.5 h-1.5 bg-white rounded-full"></div>';
            currentContainer.appendChild(miniBox);
        });
    }

    const prevContainer = document.getElementById('history-previous-list');
    if (prevContainer) {
        prevContainer.innerHTML = '';
        rolls.slice(1).forEach((entry, idx) => {
            const row = document.createElement('div');
            row.className = 'bg-red-950/70 rounded-xl p-2 border border-red-900 flex items-center gap-2 overflow-x-auto';
            
            const num = document.createElement('span');
            num.className = 'text-xs text-red-300 font-bold w-4 shrink-0';
            num.innerText = `${idx + 2}.`;
            row.appendChild(num);

            entry.dice.forEach(color => {
                const cfg = COLOR_MAP[color];
                const miniBox = document.createElement('div');
                miniBox.className = 'w-5 h-5 rounded flex items-center justify-center shrink-0 border border-white/20';
                miniBox.style.backgroundColor = cfg.bg;
                miniBox.innerHTML = '<div class="w-1 h-1 bg-white rounded-full"></div>';
                row.appendChild(miniBox);
            });

            prevContainer.appendChild(row);
        });
    }
}

export function renderVerifyView() {
    const now = Date.now();
    const delayedThreshold = now - 10000;
    const delayedRoll = state.history.find(r => r.timestamp <= delayedThreshold) || state.history[state.history.length - 1];

    const recentContainer = document.getElementById('verify-recent-dice-container');
    const recentTimestamp = document.getElementById('verify-recent-timestamp');
    
    if (recentContainer) {
        recentContainer.innerHTML = '';
        if (delayedRoll) {
            delayedRoll.dice.forEach(color => {
                const cfg = COLOR_MAP[color];
                const box = document.createElement('div');
                box.className = 'w-12 h-12 rounded-xl flex items-center justify-center border-2 border-white/20 shadow';
                box.style.backgroundColor = cfg.bg;
                box.innerHTML = '<div class="w-3 h-3 bg-white rounded-full"></div>';
                recentContainer.appendChild(box);
            });

            const secondsAgo = Math.max(10, Math.floor((now - delayedRoll.timestamp) / 1000));
            if (recentTimestamp) recentTimestamp.innerText = `Rolled ${secondsAgo}s ago`;
        } else {
            recentContainer.innerHTML = '<span class="text-xs text-sky-300">Awaiting delayed stream sync...</span>';
            if (recentTimestamp) recentTimestamp.innerText = 'Syncing...';
        }
    }

    const verifyHistoryContainer = document.getElementById('verify-history-50-list');
    if (verifyHistoryContainer) {
        verifyHistoryContainer.innerHTML = '';
        state.history.forEach((entry, idx) => {
            const item = document.createElement('div');
            item.className = 'bg-sky-950/70 rounded-xl p-2.5 border border-sky-700/60 flex flex-wrap items-center justify-between gap-2';

            const diceWrapper = document.createElement('div');
            diceWrapper.className = 'flex items-center gap-1.5 overflow-x-auto';
            
            const num = document.createElement('span');
            num.className = 'text-xs text-yellow-300 font-bold mr-1';
            num.innerText = `${idx + 1}.`;
            diceWrapper.appendChild(num);

            entry.dice.forEach(color => {
                const cfg = COLOR_MAP[color];
                const miniBox = document.createElement('div');
                miniBox.className = 'w-5 h-5 rounded flex items-center justify-center shrink-0 border border-white/20';
                miniBox.style.backgroundColor = cfg.bg;
                miniBox.innerHTML = '<div class="w-1 h-1 bg-white rounded-full"></div>';
                diceWrapper.appendChild(miniBox);
            });

            const timeSpan = document.createElement('span');
            timeSpan.className = 'text-[10px] text-sky-300 font-medium italic';
            const timeDiffSec = Math.floor((now - entry.timestamp) / 1000);
            timeSpan.innerText = timeDiffSec < 60 ? `Rolled ${timeDiffSec}s ago` : `Rolled ${Math.floor(timeDiffSec/60)}m ${timeDiffSec%60}s ago`;

            item.appendChild(diceWrapper);
            item.appendChild(timeSpan);
            verifyHistoryContainer.appendChild(item);
        });
    }
}