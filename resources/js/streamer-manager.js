import { state } from './dice-engine.js';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
});

function createStreamerCard(s) {
    const card = document.createElement('a');
    card.href = s.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = `card-inner p-2 rounded-xl flex items-center justify-between transition cursor-pointer border text-left group relative ${
        s.is_live 
            ? 'bg-red-950/80 border-red-800 hover:bg-red-900/90' 
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 opacity-80 hover:opacity-100'
    }`;

    const cleanHandle = s.handle ? s.handle.replace('@', '') : '';
    const avatarSrc = s.avatar_url || `https://unavatar.io/tiktok/${cleanHandle}`;
    const avatarHtml = `<img src="${avatarSrc}" alt="${s.name}" class="w-full h-full object-cover relative z-10" onerror="this.style.display='none'">`;

    const liveRingClass = s.is_live 
        ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-red-950' 
        : 'border-slate-700';

    const statusBadgeHtml = s.is_live 
        ? '<span class="text-[9px] font-black text-red-400 uppercase tracking-wider bg-red-950/80 px-1 rounded border border-red-800/80 animate-pulse">LIVE</span>' 
        : '<span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 px-1 rounded border border-slate-800">OFFLINE</span>';

    const liveDotHtml = s.is_live 
        ? '<span class="absolute top-0 right-0 z-20 w-2.5 h-2.5 bg-red-600 rounded-full border border-red-950 animate-pulse"></span>' 
        : '';

    card.innerHTML = `
        <div class="flex items-center space-x-2.5 overflow-hidden">
            <div class="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-yellow-200/60 bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center ${liveRingClass}">
                ${avatarHtml}
                <span class="font-bold text-xs text-red-950 absolute inset-0 flex items-center justify-center">
                    ${s.name.charAt(0).toUpperCase()}
                </span>
                ${liveDotHtml}
            </div>

            <div class="truncate">
                <div class="font-bold text-xs text-white group-hover:text-yellow-300 transition flex items-center gap-1">
                    <span class="truncate">${s.name}</span>
                    <i class="fa-solid fa-circle-check text-sky-400 text-[10px]" title="Verified"></i>
                </div>
                <div class="text-[10px] text-red-300 truncate flex items-center gap-1.5">
                    <span>${s.handle}</span>
                    ${statusBadgeHtml}
                </div>
            </div>
        </div>
        <i class="fa-brands fa-tiktok ${s.is_live ? 'text-red-400' : 'text-slate-500'} text-xs shrink-0 group-hover:text-yellow-300"></i>
    `;

    return card;
}

export function renderStreamers() {
    const leftContainer = document.getElementById('desktop-streamers-left');
    const rightContainer = document.getElementById('desktop-streamers-right');
    const mobileContainer = document.getElementById('mobile-streamers-list');

    if (leftContainer) leftContainer.innerHTML = '';
    if (rightContainer) rightContainer.innerHTML = '';
    if (mobileContainer) mobileContainer.innerHTML = '';

    // Pisahkan streamer berdasarkan status LIVE
    const liveStreamers = state.streamers.filter(s => s.is_live);
    const offlineStreamers = state.streamers.filter(s => !s.is_live);

    // 1. Render Streamer LIVE di Sidebar Kiri
    if (leftContainer) {
        if (liveStreamers.length === 0) {
            leftContainer.innerHTML = `
                <div class="text-[11px] text-red-300/70 italic py-3 text-center">
                    Belum ada streamer LIVE saat ini.
                </div>
            `;
        } else {
            liveStreamers.forEach(s => leftContainer.appendChild(createStreamerCard(s)));
        }
    }

    // 2. Render Streamer OFFLINE di Sidebar Kanan (FEATURED)
    if (rightContainer) {
        if (offlineStreamers.length === 0) {
            rightContainer.innerHTML = `
                <div class="text-[11px] text-slate-400 italic py-3 text-center">
                    Belum ada streamer featured.
                </div>
            `;
        } else {
            offlineStreamers.forEach(s => rightContainer.appendChild(createStreamerCard(s)));
        }
    }

    // 3. Render SEMUA Streamer di Mobile (LIVE lebih dulu)
    if (mobileContainer) {
        const allStreamers = [...liveStreamers, ...offlineStreamers];
        allStreamers.forEach(s => mobileContainer.appendChild(createStreamerCard(s)));
    }

    const badgeEl = document.getElementById('streamer-count-badge');
    if (badgeEl) badgeEl.innerText = `${state.streamers.length} Streamers`;
}

// export function renderStreamers() {
//     const leftContainer = document.getElementById('desktop-streamers-left');
//     const rightContainer = document.getElementById('desktop-streamers-right');
//     const mobileContainer = document.getElementById('mobile-streamers-list');

//     if (leftContainer) leftContainer.innerHTML = '';
//     if (rightContainer) rightContainer.innerHTML = '';
//     if (mobileContainer) mobileContainer.innerHTML = '';

//     state.streamers.forEach((s, idx) => {
//         const card = document.createElement('a');
//         card.href = s.url;
//         card.target = '_blank';
//         card.rel = 'noopener noreferrer';
//         // card.className = 'card-inner p-2 rounded-xl flex items-center justify-between hover:bg-red-900/90 transition cursor-pointer border border-red-800 text-left group relative';
//         card.className = `card-inner p-2 rounded-xl flex items-center justify-between transition cursor-pointer border text-left group relative ${
//             s.is_live 
//                 ? 'bg-red-950/80 border-red-800 hover:bg-red-900/90' 
//                 : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 opacity-80 hover:opacity-100'
//         }`;
//         // Bersihkan handle dari karakter '@'
//         const cleanHandle = s.handle ? s.handle.replace('@', '') : '';
        
//         // Gunakan avatar_url dari DB, atau fallback otomatis ke Unavatar TikTok
//         const avatarSrc = s.avatar_url || `https://unavatar.io/tiktok/${cleanHandle}`;
        
//         const avatarHtml = `<img src="${avatarSrc}" alt="${s.name}" class="w-full h-full object-cover relative z-10" onerror="this.style.display='none'">`;

//         // const liveRingClass = s.is_live ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-red-950' : '';
//         // const liveBadgeHtml = s.is_live ? '<span class="text-[9px] font-black text-red-400 uppercase tracking-wider bg-red-950/80 px-1 rounded border border-red-800/80 animate-pulse">LIVE</span>' : '';
//         // const liveDotHtml = s.is_live ? '<span class="absolute top-0 right-0 z-20 w-2.5 h-2.5 bg-red-600 rounded-full border border-red-950 animate-pulse"></span>' : '';
//         const liveRingClass = s.is_live 
//             ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-red-950' 
//             : 'border-slate-700';

//         const statusBadgeHtml = s.is_live 
//             ? '<span class="text-[9px] font-black text-red-400 uppercase tracking-wider bg-red-950/80 px-1 rounded border border-red-800/80 animate-pulse">LIVE</span>' 
//             : '<span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 px-1 rounded border border-slate-800"></span>';

//         const liveDotHtml = s.is_live 
//             ? '<span class="absolute top-0 right-0 z-20 w-2.5 h-2.5 bg-red-600 rounded-full border border-red-950 animate-pulse"></span>' 
//             : '';

//         card.innerHTML = `
//             <div class="flex items-center space-x-2.5 overflow-hidden">
//                 <div class="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-yellow-200/60 bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center ${liveRingClass}">
//                     ${avatarHtml}
//                     <span class="font-bold text-xs text-red-950 absolute inset-0 flex items-center justify-center">
//                         ${s.name.charAt(0).toUpperCase()}
//                     </span>
//                     ${liveDotHtml}
//                 </div>

//                 <div class="truncate">
//                     <div class="font-bold text-xs text-white group-hover:text-yellow-300 transition flex items-center gap-1">
//                         <span class="truncate">${s.name}</span>
//                         <i class="fa-solid fa-circle-check text-sky-400 text-[10px]" title="Verified"></i>
//                     </div>
//                     <div class="text-[10px] text-red-300 truncate flex items-center gap-1.5">
//                         <span>${s.handle}</span>
//                         ${statusBadgeHtml}
//                     </div>
//                 </div>
//             </div>
//             <i class="fa-brands fa-tiktok text-red-400 text-xs shrink-0 group-hover:text-yellow-300"></i>
//         `;

//         if (leftContainer && idx < 5) leftContainer.appendChild(card.cloneNode(true));
//         else if (rightContainer) rightContainer.appendChild(card.cloneNode(true));
//         if (mobileContainer) mobileContainer.appendChild(card.cloneNode(true));
//     });

//     const badgeEl = document.getElementById('streamer-count-badge');
//     if (badgeEl) badgeEl.innerText = `${state.streamers.length} Streamers`;
// }



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