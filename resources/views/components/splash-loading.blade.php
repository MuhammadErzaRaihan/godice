<!-- Fullscreen Pixel Art Splash Overlay -->
<div id="splash-overlay" class="hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-between py-10 px-4 overflow-hidden select-none">
    
    <!-- Header Dekorasi Awan & Naga -->
    <div class="w-full max-w-2xl flex justify-between items-center opacity-80 pointer-events-none px-4 pt-2">
        <div class="text-4xl animate-bounce">☁️</div>
        <div class="text-5xl animate-pulse">🐉</div>
        <div class="text-4xl animate-bounce" style="animation-delay: 0.2s;">☁️</div>
    </div>

    <!-- Center Shaking Stage Container -->
    <div class="flex flex-col items-center justify-center my-auto z-10 w-full max-w-md">
        <div class="text-yellow-300 font-game text-xs sm:text-sm uppercase tracking-widest mb-3 animate-pulse font-bold">
            ROLLING DICE...
        </div>

        <!-- Frame Dadu Splash (Diberi Frame Pekat Agar Tidak Bocor) -->
        <div class="bg-red-950/90 border-2 border-red-700/80 p-4 sm:p-6 rounded-3xl shadow-[0_0_30px_rgba(220,38,38,0.3)] w-full flex items-center justify-center">
            <div id="splash-dice-grid" class="flex flex-wrap items-center justify-center gap-3 sm:gap-5 my-2">
                <!-- Dynamically populated by JS during roll -->
            </div>
        </div>
    </div>

    <!-- Bottom Pixel Art Scene Road / Walkers -->
    <div class="w-full max-w-3xl opacity-80 pointer-events-none border-t-2 border-amber-900/40 pt-3">
        <div class="flex justify-around items-center text-2xl sm:text-3xl text-gray-400">
            <span class="animate-pulse">🕶️</span>
            <span class="animate-bounce" style="animation-delay: 0.1s;">🐘</span>
            <span class="animate-pulse" style="animation-delay: 0.3s;">🕶️</span>
            <span class="animate-bounce" style="animation-delay: 0.2s;">🐘</span>
            <span class="animate-pulse" style="animation-delay: 0.4s;">🕶️</span>
        </div>
    </div>
</div>