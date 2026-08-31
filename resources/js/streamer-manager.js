import { state } from './dice-engine.js';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
});

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
                        <i class="fa-solid fa-circle-check text-sky-400 text-[10px]" title="Verified"></i>
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
    state.streamers.forEach((s) => {
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
            <button onclick="deleteStreamer(${s.id})" class="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/60 transition" title="Remove Streamer">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        list.appendChild(row);
    });
}

/**
 * Memuat Daftar Streamer dari Database MySQL
 */
export async function loadStreamers() {
    try {
        const response = await fetch('/api/admin/streamers');
        const data = await response.json();

        if (data.success) {
            state.streamers = data.streamers;
            renderStreamers();
            renderAdminStreamerList();
        }
    } catch (error) {
        console.error('Gagal memuat data streamer:', error);
    }
}

/**
 * Tambah Streamer Terverifikasi Baru via API
 */
export async function addVerifiedStreamer() {
    const nameInput = document.getElementById('new-streamer-name');
    const handleInput = document.getElementById('new-streamer-handle');
    const urlInput = document.getElementById('new-streamer-url');

    if (!nameInput?.value || !handleInput?.value || !urlInput?.value) {
        alert('Mohon isi semua kolom streamer!');
        return;
    }

    try {
        const response = await fetch('/api/admin/streamers', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                name: nameInput.value,
                handle: handleInput.value,
                url: urlInput.value
            })
        });

        const data = await response.json();

        if (data.success) {
            nameInput.value = '';
            handleInput.value = '';
            urlInput.value = '';

            loadStreamers();
        } else {
            alert(data.message || 'Gagal menambahkan streamer.');
        }
    } catch (error) {
        console.error('Error saat menambah streamer:', error);
    }
}

/**
 * Hapus Streamer dari Database
 */
export async function deleteStreamer(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus streamer ini?')) return;

    try {
        const response = await fetch(`/api/admin/streamers/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const data = await response.json();

        if (data.success) {
            loadStreamers();
        }
    } catch (error) {
        console.error('Gagal menghapus streamer:', error);
    }
}