@extends('layouts.app')

@section('title', 'Admin Control Center — Online Dice')

@section('content')
<div id="view-admin" class="transition-all duration-300 max-w-5xl mx-auto space-y-8 py-2">
    
    <div class="bg-gradient-to-r from-slate-950 via-purple-950/90 to-slate-950 border-2 border-purple-500/70 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_30px_rgba(168,85,247,0.25)] relative overflow-hidden">
        <div class="flex items-center justify-center gap-3 sm:gap-4 mb-3">
            <i class="fa-solid fa-user-shield text-fuchsia-400 text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]"></i>
            <h2 class="font-game text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-200 to-cyan-300 font-black tracking-wider uppercase">
                ADMIN CONTROL CENTER
            </h2>
        </div>
        <p class="text-xs sm:text-sm text-purple-300/80 font-mono tracking-widest uppercase mb-5">
            SYSTEM ENGINE // WEIGHTED RIGGING & STREAMER HUB
        </p>
        
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div class="inline-flex items-center gap-2 bg-slate-950/90 border border-purple-500/60 px-4 py-2 rounded-xl text-xs text-purple-200 font-mono shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                <span>SESSION ID: <strong id="admin-session-id" class="text-cyan-300 font-bold tracking-wider">----------</strong></span>
            </div>

            <div class="inline-flex items-center gap-2 bg-purple-950/80 border border-fuchsia-500/60 px-4 py-2 rounded-xl text-xs font-mono font-bold text-fuchsia-300 uppercase shadow-[0_0_12px_rgba(217,70,239,0.2)]">
                <i class="fa-solid fa-microchip text-cyan-400"></i>
                <span>SYSTEM: CYBERPUNK PURPLE</span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        <div class="lg:col-span-7 space-y-6 sm:space-y-8">
            
            <div class="cyberpunk-card rounded-3xl p-6 sm:p-7 space-y-5">
                <div class="flex items-center justify-between border-b border-purple-800/60 pb-4">
                    <h3 class="font-game text-xl text-yellow-300 font-bold flex items-center gap-2.5 tracking-wide">
                        <i class="fa-solid fa-bullseye text-fuchsia-400"></i> TARGETED GAME ID COLOR RIG
                    </h3>
                    <span id="targeted-rig-status-badge" class="text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/80">
                        CLEAN ROLL
                    </span>
                </div>

                <p class="text-xs text-slate-300/90 leading-relaxed font-sans">
                    Masukkan Target Game ID streamer, lalu atur <strong>Warna Blokir</strong> dan <strong>Warna Wajib Keluar</strong> khusus untuk ID tersebut.
                </p>

                <div class="space-y-4">
                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                            <label class="block text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">Target Game ID</label>
                            <button type="button" onclick="fillActiveSessionId()" class="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer flex items-center gap-1">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Use Active Session ID
                            </button>
                        </div>
                        <input type="text" id="rig-target-game-id" oninput="onTargetGameIdChange(this.value)" placeholder="Contoh: eZKHz1tywk" class="w-full bg-slate-950/90 border border-purple-700/80 text-sm text-cyan-300 font-mono font-bold p-3 rounded-xl focus:outline-none focus:border-fuchsia-400 transition placeholder:text-slate-600">
                    </div>

                    <!-- 1. Matriks Warna Dilarang / Diblokir -->
                    <div>
                        <label class="block text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i class="fa-solid fa-ban text-rose-400"></i> 1. Blokir Warna (Dilarang Keluar):
                        </label>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="targeted-color-toggles">
                            <!-- Populated dynamically via JS -->
                        </div>
                    </div>

                    <!-- 2. Matriks Warna Wajib Keluar -->
                    <div class="pt-2">
                        <label class="block text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i class="fa-solid fa-star text-amber-400"></i> 2. Warna Wajib Keluar (Fix Guarantee):
                        </label>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="targeted-forced-color-toggles">
                            <!-- Populated dynamically via JS -->
                        </div>
                    </div>

                    <!-- Quick Presets -->
                    <div class="pt-4 mt-2 border-t border-purple-900/80 space-y-3">
                        <label class="block text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">Quick Presets:</label>
                        <div class="flex flex-wrap gap-2.5">
                            <button type="button" onclick="applyTargetedRigPreset('clean')" class="bg-purple-950/90 hover:bg-purple-900 text-white text-xs px-3 py-2 rounded-xl border border-purple-600/80 font-semibold transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-rotate-left text-emerald-400"></i> Reset All (Fair)
                            </button>
                            <button type="button" onclick="applyTargetedRigPreset('block-3-guarantee-yellow')" class="bg-purple-950/90 hover:bg-purple-900 text-amber-300 text-xs px-3 py-2 rounded-xl border border-amber-500/80 font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-bullseye text-amber-400"></i> Block 3 & Fix Yellow 🔥
                            </button>
                            <button type="button" onclick="applyTargetedRigPreset('no-red-blue')" class="bg-purple-950/90 hover:bg-purple-900 text-white text-xs px-3 py-2 rounded-xl border border-purple-600/80 font-semibold transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-ban text-rose-400"></i> Block Red & Blue
                            </button>
                            <button type="button" onclick="applyTargetedRigPreset('only-yellow')" class="bg-purple-950/90 hover:bg-purple-900 text-white text-xs px-3 py-2 rounded-xl border border-purple-600/80 font-semibold transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-star text-yellow-400"></i> Only Yellow
                            </button>
                        </div>
                    </div>

                    <button onclick="saveTargetedColorRig()" class="btn-yellow w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                        <i class="fa-solid fa-lock text-sm"></i> Simpan Aturan Rigging Game ID
                    </button>
                </div>
            </div>

            <div class="cyberpunk-card rounded-3xl p-6 sm:p-7 space-y-5">
                <div class="flex items-center justify-between border-b border-purple-800/60 pb-4">
                    <h3 class="font-game text-xl text-yellow-300 font-bold flex items-center gap-2.5 tracking-wide">
                        <i class="fa-solid fa-sliders text-fuchsia-400"></i> GLOBAL COLOR RIG CONTROL
                    </h3>
                    <span id="rig-status-badge" class="text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/80">
                        FAIR / CLEAN ROLL
                    </span>
                </div>

                <!-- Global Blocked Colors -->
                <div>
                    <label class="block text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-ban text-rose-400"></i> Global Blocked Colors:
                    </label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="admin-color-toggles">
                        <!-- Populated dynamically via JS -->
                    </div>
                </div>

                <!-- Global Forced Colors -->
                <div class="pt-2">
                    <label class="block text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-star text-amber-400"></i> Global Guaranteed Colors:
                    </label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="admin-forced-color-toggles">
                        <!-- Populated dynamically via JS -->
                    </div>
                </div>

                <!-- Quick Rig Presets -->
                <div class="pt-4 mt-2 border-t border-purple-900/80 space-y-3">
                    <label class="block text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">Quick Presets:</label>
                    <div class="flex flex-wrap gap-2.5">
                        <button onclick="applyRigPreset('clean')" class="bg-purple-950/90 hover:bg-purple-900 text-white text-xs px-3.5 py-2 rounded-xl border border-purple-600/80 font-semibold transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-rotate-left text-emerald-400"></i> Reset All (Fair)
                        </button>
                        <button onclick="applyRigPreset('block-3-guarantee-yellow')" class="bg-purple-950/90 hover:bg-purple-900 text-amber-300 text-xs px-3.5 py-2 rounded-xl border border-amber-500/80 font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-bullseye text-amber-400"></i> Block 3 & Fix Yellow 🔥
                        </button>
                    </div>
                </div>
            </div>

            <!-- Live Test Console -->
            <div class="cyberpunk-card rounded-3xl p-6 sm:p-7 space-y-4">
                <h3 class="font-game text-xl text-yellow-300 font-bold border-b border-purple-800/60 pb-3 flex items-center gap-2.5 tracking-wide">
                    <i class="fa-solid fa-vial text-fuchsia-400"></i> LIVE RIG TESTER
                </h3>
                <p class="text-xs text-slate-300/90">Test execute a roll using the current rig configuration:</p>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/90 rounded-2xl p-4 border border-purple-900/80 min-h-[60px]">
                    <button onclick="testAdminRoll()" class="btn-yellow px-5 py-2.5 text-xs font-bold rounded-xl uppercase shrink-0 tracking-wider shadow cursor-pointer">
                        Test Roll
                    </button>
                    <div id="admin-test-roll-result" class="flex flex-wrap gap-2 items-center flex-1 min-h-[32px]">
                        <span class="text-xs text-slate-400 font-mono italic">Click test to generate outcome...</span>
                    </div>
                </div>
            </div>

        </div>

        <div class="lg:col-span-5 space-y-6 sm:space-y-8">
            <div class="cyberpunk-card rounded-3xl p-6 sm:p-7 space-y-5">
                <h3 class="font-game text-xl text-yellow-300 font-bold border-b border-purple-800/60 pb-3 flex items-center gap-2.5 tracking-wide">
                    <i class="fa-solid fa-user-plus text-fuchsia-400"></i> ADD VERIFIED STREAMER
                </h3>

                <div class="space-y-4 pt-1">
                    <div>
                        <label class="block text-[11px] text-purple-300 font-mono font-bold uppercase tracking-wider mb-1.5">Streamer Name</label>
                        <input type="text" id="new-streamer-name" placeholder="e.g., FREXX GAMING" class="w-full bg-slate-950/90 border border-purple-700/80 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-fuchsia-400 font-medium transition placeholder:text-slate-600">
                    </div>
                    <div>
                        <label class="block text-[11px] text-purple-300 font-mono font-bold uppercase tracking-wider mb-1.5">Handle / Username</label>
                        <input type="text" id="new-streamer-handle" placeholder="e.g., @frexx100" class="w-full bg-slate-950/90 border border-purple-700/80 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-fuchsia-400 font-medium transition placeholder:text-slate-600">
                    </div>
                    <div>
                        <label class="block text-[11px] text-purple-300 font-mono font-bold uppercase tracking-wider mb-1.5">TikTok Live URL</label>
                        <input type="text" id="new-streamer-url" placeholder="e.g., https://tiktok.com/@frexx100/live" class="w-full bg-slate-950/90 border border-purple-700/80 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-fuchsia-400 font-medium transition placeholder:text-slate-600">
                    </div>

                    <button onclick="addVerifiedStreamer()" class="btn-yellow w-full py-3 mt-2 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                        <i class="fa-solid fa-plus text-sm"></i> Add to Top Streamers
                    </button>
                </div>
            </div>

            <div class="cyberpunk-card rounded-3xl p-6 sm:p-7 space-y-4">
                <h3 class="font-game text-xl text-yellow-300 font-bold border-b border-purple-800/60 pb-3 flex items-center justify-between tracking-wide">
                    <span>ACTIVE DIRECTORY</span>
                    <span id="streamer-count-badge" class="text-xs font-mono bg-purple-950 text-fuchsia-300 px-2.5 py-1 rounded-lg border border-purple-700/80">0 Streamers</span>
                </h3>

                <div id="admin-streamers-manage-list" class="space-y-2.5 max-h-[280px] overflow-y-auto pr-1.5">
                    <!-- Populated dynamically via JS -->
                </div>
            </div>
        </div>

    </div>

</div>
@endsection