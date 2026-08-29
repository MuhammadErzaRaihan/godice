import { state } from './dice-engine.js';

export function renderStreamers() {
    const leftContainer = document.getElementById('desktop-streamers-left');
    const rightContainer = document.getElementById('desktop-streamers-right');
    const mobileContainer = document.getElementById('mobile-streamers-list');

    if (leftContainer) leftContainer.innerHTML = '';
    if (rightContainer) rightContainer.innerHTML = '';
    if (mobileContainer) mobileContainer.innerHTML = '';

    state.streamers.forEach((s, idx) => {
        const card = document.createElement('a');
        card.href = s.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'card-inner p-2 rounded-xl flex items-center justify-between hover:bg-red-900/90 transition cursor-pointer border border-red-800 text-left group';

        card.innerHTML = `
            <div class="flex items-center space-x-2.5 overflow-hidden">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center font-bold text-xs text-red-950 shrink-0 border border-yellow-200">
                    ${s.name.charAt(0)}
                </div>
                <div class="truncate">
                    <div class="font-bold text-xs text-white group-hover:text-yellow-300 transition flex items-center gap-1">
                        <span class="truncate">${s.name}</span>
                        ${s.verified ? '<i class="fa-solid fa-circle-check text-sky-400 text-[10px]" title="Verified"></i>' : ''}
                    </div>
                    <div class="text-[10px] text-red-300 truncate">${s.handle}</div>
                </div>
            </div>
            <i class="fa-brands fa-tiktok text-red-400 text-xs shrink-0 group-hover:text-yellow-300"></i>
        `;

        if (leftContainer && idx < 5) leftContainer.appendChild(card.cloneNode(true));
        else if (rightContainer) rightContainer.appendChild(card.cloneNode(true));
        if (mobileContainer) mobileContainer.appendChild(card.cloneNode(true));
    });

    const badgeEl = document.getElementById('streamer-count-badge');
    if (badgeEl) badgeEl.innerText = `${state.streamers.length} Streamers`;
}

export function renderAdminStreamerList() {
    const list = document.getElementById('admin-streamers-manage-list');
    if (!list) return;

    list.innerHTML = '';
    state.streamers.forEach((s, idx) => {
        const row = document.createElement('div');
        row.className = 'bg-slate-950 rounded-xl p-2.5 border border-purple-900 flex items-center justify-between gap-2';
        row.innerHTML = `
            <div class="truncate text-xs">
                <div class="font-bold text-white flex items-center gap-1.5">
                    <span>${s.name}</span>
                    <i class="fa-solid fa-circle-check text-sky-400 text-[10px]"></i>
                </div>
                <div class="text-[10px] text-purple-300 truncate">${s.handle}</div>
            </div>
            <button onclick="removeStreamer(${idx})" class="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/60 transition" title="Remove Streamer">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        list.appendChild(row);
    });
}

export function removeStreamer(index) {
    state.streamers.splice(index, 1);
    renderStreamers();
    renderAdminStreamerList();
}

export function addVerifiedStreamer() {
    const nameEl = document.getElementById('new-streamer-name');
    const handleEl = document.getElementById('new-streamer-handle');
    const urlEl = document.getElementById('new-streamer-url');

    const name = nameEl ? nameEl.value.trim() : '';
    const handle = handleEl ? handleEl.value.trim() : '';
    const url = urlEl ? urlEl.value.trim() : '';

    if (!name || !handle || !url) {
        alert('Please fill out all streamer fields.');
        return;
    }

    state.streamers.unshift({ name, handle, verified: true, url });
    renderStreamers();
    renderAdminStreamerList();

    if (nameEl) nameEl.value = '';
    if (handleEl) handleEl.value = '';
    if (urlEl) urlEl.value = '';
}