<div id="panel-last-20" class="card-red rounded-3xl p-4 sm:p-5 shadow-2xl relative">
    <button onclick="toggleLast20Panel()" class="absolute top-4 right-4 text-red-300 hover:text-white text-lg">
        <i class="fa-solid fa-xmark"></i>
    </button>

    <h4 class="font-game text-xl text-yellow-300 font-bold mb-3 border-b border-red-800 pb-2">
        YOUR LAST 20 ROLLS
    </h4>

    <!-- Roll Stats Breakdown Area -->
    <div class="bg-red-950/80 rounded-2xl p-4 border border-red-800/80 mb-4 text-xs space-y-3">
        <!-- STATS SECTION -->
        <div>
            <div class="font-bold text-red-200 uppercase tracking-wider text-[10px] mb-1.5">STATS:</div>
            <div id="stats-color-breakdown" class="flex flex-wrap gap-2">
                <!-- Rendered dynamically via JS -->
            </div>
        </div>

        <!-- LONGEST STREAK SECTION -->
        <div class="pt-2 border-t border-red-900/80">
            <div class="font-bold text-red-200 uppercase tracking-wider text-[10px] mb-1.5">LONGEST STREAK:</div>
            <div id="stats-longest-streak" class="flex flex-wrap gap-2">
                <!-- Rendered dynamically via JS -->
            </div>
        </div>
    </div>

    <!-- Live Roll History Rows -->
    <div class="space-y-3">
        <div>
            <div class="text-[11px] font-bold text-yellow-300 uppercase tracking-wider mb-1">THIS ROLL:</div>
            <div id="history-row-current" class="bg-red-950/90 rounded-xl p-2.5 border border-red-800 flex items-center gap-2 overflow-x-auto">
                <!-- Current roll rendered via JS -->
            </div>
        </div>

        <div>
            <div class="text-[11px] font-bold text-red-300 uppercase tracking-wider mb-1">PREVIOUS ROLLS:</div>
            <div id="history-previous-list" class="space-y-2 max-h-60 overflow-y-auto pr-1">
                <!-- Past rolls list rendered via JS -->
            </div>
        </div>
    </div>
</div>