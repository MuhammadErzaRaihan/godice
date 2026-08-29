@extends('layouts.app')

@section('title', 'Verify Game ID — Online Dice')

@section('content')
<div id="view-verify" class="transition-all duration-300 max-w-2xl mx-auto space-y-6">
    
    <!-- Verify Header Card -->
    <div class="card-blue rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        <div class="flex items-center justify-center gap-2 mb-2">
            <i class="fa-solid fa-shield-halved text-yellow-300 text-3xl"></i>
            <h2 class="font-game text-3xl sm:text-4xl text-yellow-300 font-black tracking-wide">VERIFY</h2>
        </div>
        <p class="text-xs text-sky-100">Independent Game Audit & Roll Transparency</p>

        <!-- Game ID Input & Refresh Button -->
        <div class="mt-6 bg-sky-950/80 rounded-2xl p-4 border border-sky-600/50 space-y-3">
            <label class="block text-xs font-bold text-sky-200 uppercase tracking-wider text-left">
                <i class="fa-solid fa-fingerprint mr-1"></i> GAME ID:
            </label>
            <input type="text" id="verify-game-id-input" readonly value="5xAbu7HCMb" class="w-full bg-sky-900 border-2 border-sky-400 text-yellow-300 font-mono text-center text-lg sm:text-xl font-bold rounded-xl py-2 focus:outline-none shadow-inner">
            <button onclick="refreshVerification()" class="btn-yellow w-full py-2.5 rounded-xl font-game text-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <i class="fa-solid fa-arrows-rotate"></i> REFRESH
            </button>
        </div>
    </div>

    <!-- Most Recent Roll Box (Delayed by 10 Seconds) -->
    <div class="card-blue rounded-3xl p-5 text-center shadow-2xl space-y-4">
        <div class="border-b border-sky-600/60 pb-2">
            <h3 class="font-game text-xl text-yellow-300 uppercase tracking-wide">
                MOST RECENT ROLL
            </h3>
            <p class="text-xs font-bold text-red-300 uppercase tracking-widest">(DELAYED BY 10 SECONDS)</p>
        </div>

        <!-- Delayed Dice Grid Display -->
        <div id="verify-recent-dice-container" class="bg-sky-950/80 rounded-2xl p-4 border border-sky-700 flex flex-wrap items-center justify-center gap-3 min-h-[100px]">
            <!-- Rendered dynamically via JS -->
        </div>

        <div id="verify-recent-timestamp" class="text-xs text-sky-200 font-semibold italic">
            Syncing...
        </div>
    </div>

    <!-- Red Disclaimer Box -->
    <div class="bg-red-900/90 border-2 border-red-500 rounded-2xl p-4 text-center space-y-2 shadow-xl">
        <div class="text-red-200 text-xs sm:text-sm font-semibold leading-relaxed">
            If these colors do not agree with what you saw on a livestream, then the results were rigged.
        </div>
        <div class="text-red-300 text-xs font-medium leading-relaxed">
            Please note: Data is delayed by 10 seconds to compensate for TikTok livestream transmission delays.
        </div>
    </div>

    <!-- Last 50 Rolls Log Table -->
    <div class="card-blue rounded-3xl p-5 shadow-2xl space-y-4">
        <h4 class="font-game text-xl text-yellow-300 uppercase tracking-wide border-b border-sky-600/60 pb-2">
            LAST 50 ROLLS IN THIS SESSION
        </h4>

        <div id="verify-history-50-list" class="space-y-3 max-h-96 overflow-y-auto pr-1">
            <!-- Populated via JS -->
        </div>
    </div>

</div>
@endsection