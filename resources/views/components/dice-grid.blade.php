<div class="relative mb-4 bg-red-950/80 rounded-2xl p-4 sm:p-6 border-2 border-red-800/80 min-h-[140px] flex flex-col items-center justify-center space-y-3">
    
    <!-- Sleek Top Badge when Anti-Ban Active -->
    <div id="anti-ban-overlay-label" class="hidden absolute top-2 right-2 z-20 px-2.5 py-1 bg-black/60 rounded-lg text-yellow-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-yellow-500/30 pointer-events-none shadow">
        <i class="fa-solid fa-eye-slash text-xs"></i>
        <span>Anti-Ban Active (Hover dice to reveal)</span>
    </div>

    <!-- Colored Dice Grid Container (ID dipertahankan: dice-container) -->
    <div id="dice-container" class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 transition-all duration-300 w-full min-h-[100px]">
        <!-- Rendered dynamically via JavaScript -->
    </div>

    <!-- ID & Verify Link (Di dalam box gelap, tepat di bawah dadu) -->
    <div class="flex items-center justify-center gap-1.5 text-white font-mono text-sm sm:text-base pt-1">
        <span class="text-gray-300 font-semibold">ID:</span>
        <strong id="current-game-id" class="text-white font-black tracking-wider text-base sm:text-2xl">Z5Fyk47ZdT</strong>
        <span class="text-gray-300">-</span>
        <a href="{{ route('dice.verify') }}" class="text-white underline hover:text-yellow-300 transition font-sans font-semibold text-xs sm:text-sm">
            Verify
        </a>
    </div>

    <!-- Info Pill Banner -->
    <div class="bg-white text-blue-700 px-10 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg border border-gray-200">
        <span class="bg-blue-600 text-white text-[10px] w-4 h-4 rounded flex items-center justify-center font-serif italic font-bold">i</span>
        <span>Always verify the game ID</span>
    </div>

</div>