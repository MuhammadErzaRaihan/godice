import { state } from './dice-engine.js';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
});

// function createStreamerCard(s) {
//     const card = document.createElement('a');
//     card.href = s.url;
//     card.target = '_blank';
//     card.rel = 'noopener noreferrer';
//     card.className = `card-inner p-2 rounded-xl flex items-center justify-between transition cursor-pointer border text-left group relative ${
//         s.is_live 
//             ? 'bg-red-950/80 border-red-800 hover:bg-red-900/90' 
//             : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 opacity-80 hover:opacity-100'
//     }`;

//     const cleanHandle = s.handle ? s.handle.replace('@', '') : '';
//     const avatarSrc = s.avatar_url || `https://unavatar.io/tiktok/${cleanHandle}`;
//     const avatarHtml = `<img src="${avatarSrc}" alt="${s.name}" class="w-full h-full object-cover relative z-10" onerror="this.style.display='none'">`;

//     const liveRingClass = s.is_live 
//         ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-red-950' 
//         : 'border-slate-700';

//     const statusBadgeHtml = s.is_live 
//         ? '<span class="text-[9px] font-black text-red-400 uppercase tracking-wider bg-red-950/80 px-1 rounded border border-red-800/80 animate-pulse">LIVE</span>' 
//         : '<span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 px-1 rounded border border-slate-800">OFFLINE</span>';

//     const liveDotHtml = s.is_live 
//         ? '<span class="absolute top-0 right-0 z-20 w-2.5 h-2.5 bg-red-600 rounded-full border border-red-950 animate-pulse"></span>' 
//         : '';

//     card.innerHTML = `
//         <div class="flex items-center space-x-2.5 overflow-hidden">
//             <div class="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-yellow-200/60 bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center ${liveRingClass}">
//                 ${avatarHtml}
//                 <span class="font-bold text-xs text-red-950 absolute inset-0 flex items-center justify-center">
//                     ${s.name.charAt(0).toUpperCase()}
//                 </span>
//                 ${liveDotHtml}
//             </div>

//             <div class="truncate">
//                 <div class="font-bold text-xs text-white group-hover:text-yellow-300 transition flex items-center gap-1">
//                     <span class="truncate">${s.name}</span>
//                     <i class="fa-solid fa-circle-check text-sky-400 text-[10px]" title="Verified"></i>
//                 </div>
//                 <div class="text-[10px] text-red-300 truncate flex items-center gap-1.5">
//                     <span>${s.handle}</span>
//                     ${statusBadgeHtml}
//                 </div>
//             </div>
//         </div>
//         <i class="fa-brands fa-tiktok ${s.is_live ? 'text-red-400' : 'text-slate-500'} text-xs shrink-0 group-hover:text-yellow-300"></i>
//     `;

//     return card;
// }


function createStreamerCard(s) {
    const card = document.createElement('a');
    
    // Validasi URL agar tidak bisa disisipi 'javascript:alert(1)'
    const safeUrl = (s.url && (s.url.startsWith('http://') || s.url.startsWith('https://'))) ? s.url : '#';
    card.href = safeUrl;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = `card-inner p-2 rounded-xl flex items-center justify-between transition cursor-pointer border text-left group relative ${
        s.is_live 
            ? 'bg-red-950/80 border-red-800 hover:bg-red-900/90' 
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 opacity-80 hover:opacity-100'
    }`;

    // Escape nama dan handle
    const escapedName = escapeHtml(s.name);
    const escapedHandle = escapeHtml(s.handle);
    const cleanHandle = s.handle ? s.handle.replace('@', '') : '';
    
    const avatarSrc = s.avatar_url || `https://unavatar.io/tiktok/${encodeURIComponent(cleanHandle)}`;
    const avatarHtml = `<img src="${avatarSrc}" alt="${escapedName}" class="w-full h-full object-cover relative z-10" onerror="this.style.display='none'">`;

    const liveRingClass = s.is_live ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-red-950' : 'border-slate-700';
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
                    ${escapedName.charAt(0).toUpperCase()}
                </span>
                ${liveDotHtml}
            </div>

            <div class="truncate">
                <div class="font-bold text-xs text-white group-hover:text-yellow-300 transition flex items-center gap-1">
                    <span class="truncate">${escapedName}</span>
                    <i class="fa-solid fa-circle-check text-sky-400 text-[10px]" title="Verified"></i>
                </div>
                <div class="text-[10px] text-red-300 truncate flex items-center gap-1.5">
                    <span>${escapedHandle}</span>
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

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// export function renderAdminStreamerList() {
//     const list = document.getElementById('admin-streamers-manage-list');
//     if (!list) return;

//     list.innerHTML = '';
//     state.streamers.forEach((s) => {
//         // Gunakan vip_token dari database, atau fallback jika belum ada
//         const secretToken = s.vip_token || s.handle.replace('@', '');
//         const secretVipUrl = `${window.location.origin}/vip/${secretToken}`;

//         const row = document.createElement('div');
//         row.className = 'bg-slate-950 rounded-xl p-2.5 border border-purple-900 flex items-center justify-between gap-2';
//         row.innerHTML = `
//             <div class="truncate text-xs">
//                 <div class="font-bold text-white flex items-center gap-1.5">
//                     <span>${s.name}</span>
//                     <i class="fa-solid fa-circle-check text-sky-400 text-[10px]"></i>
//                 </div>
//                 <div class="text-[10px] text-purple-300 truncate">${s.handle}</div>
//             </div>

//             <div class="flex items-center gap-1.5">
//                 <!-- Tombol Copy Link Secret VIP -->
//                 <button onclick="navigator.clipboard.writeText('${secretVipUrl}'); alert('Link Rahasia VIP disalin: ${secretVipUrl}')" 
//                         class="text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 px-2.5 py-1 rounded transition border border-amber-500/40 flex items-center gap-1" 
//                         title="Copy Secret VIP Link">
//                     <i class="fa-solid fa-key text-[10px]"></i> Copy Secret VIP Link
//                 </button>

//                 <button onclick="deleteStreamer(${s.id})" 
//                         class="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/60 transition" 
//                         title="Remove Streamer">
//                     <i class="fa-solid fa-trash-can"></i>
//                 </button>
//             </div>
//         `;
//         list.appendChild(row);
//     });
// }

export function renderAdminStreamerList() {
    const list = document.getElementById('admin-streamers-manage-list');
    if (!list) return;

    list.innerHTML = '';
    state.streamers.forEach((s) => {
        const secretToken = s.vip_token || s.handle.replace('@', '');
        const secretVipUrl = `${window.location.origin}/vip/${encodeURIComponent(secretToken)}`;

        const row = document.createElement('div');
        row.className = 'bg-slate-950 rounded-xl p-2.5 border border-purple-900 flex items-center justify-between gap-2';
        
        // Selalu gunakan escapeHtml() saat menyisipkan teks
        row.innerHTML = `
            <div class="truncate text-xs">
                <div class="font-bold text-white flex items-center gap-1.5">
                    <span>${escapeHtml(s.name)}</span>
                    <i class="fa-solid fa-circle-check text-sky-400 text-[10px]"></i>
                </div>
                <div class="text-[10px] text-purple-300 truncate">${escapeHtml(s.handle)}</div>
            </div>

            <div class="flex items-center gap-1.5">
                <button onclick="navigator.clipboard.writeText('${secretVipUrl}'); alert('Link VIP disalin')" 
                        class="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40">
                    <i class="fa-solid fa-key text-[10px]"></i> VIP Link
                </button>
                <button onclick="deleteStreamer(${parseInt(s.id)})" class="text-xs text-rose-400 px-2 py-1">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
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