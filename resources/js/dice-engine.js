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
    currentRoll: ['Red', 'Green', 'Orange', 'Orange'], // Default initial state agar tidak kosong
    currentGameId: 'Z5Fyk47ZdT',
    counter: 0,
    antiBan: false,
    excludedColors: [],
    history: [],
    usersOnline: 792,
    streamers: []
};

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
});

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

export function getRandomColor() {
    const available = ALL_COLORS.filter(c => !state.excludedColors.includes(c));
    const pool = available.length > 0 ? available : ALL_COLORS;
    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate dadu lokal secara cepat
 */
export function generateLocalRoll() {
    const localDice = [];
    for (let i = 0; i < state.diceCount; i++) {
        localDice.push(getRandomColor());
    }
    state.currentRoll = localDice;

    // Masukkan lemparan baru ke urutan pertama (paling atas)
    state.history.unshift({
        game_id: state.currentGameId,
        dice: [...localDice],
        timestamp: Date.now()
    });
    if (state.history.length > 50) state.history.pop();

    renderMainDiceGrid();
    renderLast20Panel();
}

/**
 * Trigger Roll: Animasi Splash -> Render Lokal -> Sync DB API
 */
export async function triggerRoll() {
    playRollSound();
    const splash = document.getElementById('splash-overlay');
    const splashDiceGrid = document.getElementById('splash-dice-grid');
    const btnGoAgain = document.getElementById('btn-go-again');

    if (btnGoAgain) btnGoAgain.disabled = true;

    // Render animasi splash
    if (splash && splashDiceGrid) {
        splashDiceGrid.innerHTML = '';
        for (let i = 0; i < state.diceCount; i++) {
            const box = document.createElement('div');
            box.className = 'w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-100 shadow-2xl animate-dice-tumble';
            box.style.animationDelay = `${(i * 0.08).toFixed(2)}s`;

            const dot = document.createElement('div');
            dot.className = 'w-3 h-3 bg-gray-200 rounded-full shadow-inner';
            box.appendChild(dot);
            splashDiceGrid.appendChild(box);
        }
        splash.classList.remove('hidden');
    }

    // Render dadu secara lokal langsung (Fallback Cepat)
    generateLocalRoll();

    try {
        const response = await fetch('/api/dice/roll', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ dice_count: state.diceCount })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                state.currentRoll = data.dice;
                state.currentGameId = data.game_id;

                renderMainDiceGrid();
                renderGameId();
                await fetchRollHistory();
            }
        }
    } catch (error) {
        console.error('API backend offline/error, menggunakan mode acak lokal:', error);
    } finally {
        if (splash) splash.classList.add('hidden');
        if (btnGoAgain) btnGoAgain.disabled = false;
    }
}

/**
 * Fetch 20 Riwayat Roll Terakhir dari Database
 */
/**
 * Fetch 20 Riwayat Roll Terakhir dari Database
 */
export async function fetchRollHistory() {
    try {
        const response = await fetch('/api/dice/history');
        if (!response.ok) return;

        const data = await response.json();

        if (data.success && data.history && data.history.length > 0) {
            state.history = data.history;
            // Sinkronkan tampilan dengan hasil lemparan terakhir dari database
            state.currentRoll = data.history[0].dice;
            state.currentGameId = data.history[0].game_id;
            
            renderMainDiceGrid();
            renderGameId();
            renderLast20Panel();
            renderVerifyView();
        } else {
            // Jika database murni masih kosong
            renderMainDiceGrid();
            renderGameId();
            renderLast20Panel();
        }
    } catch (error) {
        console.error('Gagal memuat riwayat roll:', error);
        renderMainDiceGrid();
        renderGameId();
        renderLast20Panel();
    }
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
        dot.className = 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-white rounded-full shadow-inner';
        
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
    triggerRoll();
}

export function renderLast20Panel() {
    const rolls = state.history.slice(0, 20);

    const streakDisplayEl = document.getElementById('roll-streak-display');
    const longestStreakEl = document.getElementById('stats-longest-streak');

    // 1. Jika riwayat roll masih kosong
    if (rolls.length === 0 || !rolls[0] || !Array.isArray(rolls[0].dice)) {
        if (streakDisplayEl) {
            streakDisplayEl.innerHTML = `
                <div class="inline-flex items-center gap-1.5 bg-red-900/50 px-2.5 py-1 rounded-xl text-red-200 border border-red-700 shadow-sm ml-1">
                    <span class="font-bold text-xs">0</span>
                    <span class="text-xs">🔥</span>
                </div>
            `;
        }
        if (longestStreakEl) {
            longestStreakEl.innerHTML = `<span class="text-xs text-gray-400">No active streak</span>`;
        }
        return;
    }

    // 2. Hitung total kemunculan tiap warna (untuk statistik breakdown warna)
    const colorCounts = {};
    ALL_COLORS.forEach(c => colorCounts[c] = 0);

    rolls.forEach(r => {
        if (Array.isArray(r.dice)) {
            r.dice.forEach(c => {
                colorCounts[c] = (colorCounts[c] || 0) + 1;
            });
        }
    });

    // Render STATS Breakdown
    const statsContainer = document.getElementById('stats-color-breakdown');
    if (statsContainer) {
        statsContainer.innerHTML = '';
        ALL_COLORS.forEach(color => {
            const count = colorCounts[color];
            if (count > 0) {
                const cfg = COLOR_MAP[color];
                const pill = document.createElement('div');
                pill.className = 'bg-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs sm:text-sm shadow-md border border-gray-200 inline-flex';
                pill.innerHTML = `
                    <div class="w-5 h-5 rounded flex items-center justify-center shrink-0 border border-black/10" style="background-color: ${cfg.bg}">
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <span style="color: ${cfg.bg}">x${count}</span>
                    <span>🏆</span>
                `;
                statsContainer.appendChild(pill);
            }
        });
    }

    // 3. HITUNG ACTIVE CONSECUTIVE STREAK
    const latestDice = rolls[0].dice;
    const latestColorCounts = {};
    latestDice.forEach(c => latestColorCounts[c] = (latestColorCounts[c] || 0) + 1);

    // Cari warna dominan di roll terbaru
    let activeColor = null;
    let activeColorCountInLatest = 0;
    Object.keys(latestColorCounts).forEach(c => {
        if (latestColorCounts[c] > activeColorCountInLatest) {
            activeColorCountInLatest = latestColorCounts[c];
            activeColor = c;
        }
    });

    let activeStreak = 0;
    if (activeColor) {
        for (let i = 0; i < rolls.length; i++) {
            const diceInRoll = rolls[i].dice || [];
            const countInRoll = diceInRoll.filter(c => c === activeColor).length;

            if (countInRoll > 0) {
                activeStreak += countInRoll;
            } else {
                break; // Terputus jika ada roll yang tidak memuat activeColor
            }
        }
    }

    const activeCfg = activeColor ? COLOR_MAP[activeColor] : null;

    // 4. Update Badge Roll Streak (Syarat Minimal: activeStreak >= 2)
    if (streakDisplayEl) {
        if (activeStreak >= 2 && activeCfg) {
            streakDisplayEl.innerHTML = `
                <div class="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl text-gray-900 border border-amber-300 shadow-sm ml-1">
                    <div class="w-4 h-4 rounded flex items-center justify-center border border-black/10 shrink-0" style="background-color: ${activeCfg.bg}">
                        <div class="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <span class="font-bold text-xs" style="color: ${activeCfg.bg}">x${activeStreak}</span>
                    <span class="text-xs">🔥</span>
                </div>
            `;
        } else {
            // Tampilkan 0 jika warna baru keluar 1x atau tidak ada streak
            streakDisplayEl.innerHTML = `
                <div class="inline-flex items-center gap-1.5 bg-red-900/50 px-2.5 py-1 rounded-xl text-red-200 border border-red-700 shadow-sm ml-1">
                    <span class="font-bold text-xs">0</span>
                    <span class="text-xs">🔥</span>
                </div>
            `;
        }
    }

    // 5. Render LONGEST STREAK pada Panel History (Minimal 2x kemunculan)
    if (longestStreakEl) {
        if (activeStreak >= 2 && activeCfg) {
            longestStreakEl.innerHTML = `
                <div class="bg-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs sm:text-sm shadow-md border border-gray-200 inline-flex">
                    <div class="w-5 h-5 rounded flex items-center justify-center shrink-0 border border-black/10" style="background-color: ${activeCfg.bg}">
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <span style="color: ${activeCfg.bg}">x${activeStreak}</span>
                    <span>🔥</span>
                </div>
            `;
        } else {
            longestStreakEl.innerHTML = `<span class="text-xs text-gray-400">No active streak</span>`;
        }
    }

    // 6. Render 'THIS ROLL'
    const currentContainer = document.getElementById('history-row-current');
    if (currentContainer && rolls[0] && Array.isArray(rolls[0].dice)) {
        currentContainer.innerHTML = '<span class="text-xs text-yellow-300 font-bold mr-2">1.</span>';
        rolls[0].dice.forEach(color => {
            const cfg = COLOR_MAP[color] || COLOR_MAP['Red'];
            const miniBox = document.createElement('div');
            miniBox.className = 'w-6 h-6 rounded-md flex items-center justify-center shrink-0 border border-white/20';
            miniBox.style.backgroundColor = cfg.bg;
            miniBox.innerHTML = '<div class="w-1.5 h-1.5 bg-white rounded-full"></div>';
            currentContainer.appendChild(miniBox);
        });
    }

    // 7. Render 'PREVIOUS ROLLS'
    const prevContainer = document.getElementById('history-previous-list');
    if (prevContainer) {
        prevContainer.innerHTML = '';
        rolls.slice(1).forEach((entry, idx) => {
            if (!Array.isArray(entry.dice)) return;
            const row = document.createElement('div');
            row.className = 'bg-red-950/70 rounded-xl p-2 border border-red-900 flex items-center gap-2 overflow-x-auto';
            
            const num = document.createElement('span');
            num.className = 'text-xs text-red-300 font-bold w-4 shrink-0';
            num.innerText = `${idx + 2}.`;
            row.appendChild(num);

            entry.dice.forEach(color => {
                const cfg = COLOR_MAP[color] || COLOR_MAP['Red'];
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
                const cfg = COLOR_MAP[color] || COLOR_MAP['Red'];
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
                const cfg = COLOR_MAP[color] || COLOR_MAP['Red'];
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