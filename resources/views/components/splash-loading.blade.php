<div id="splash-overlay" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between py-10 px-4 overflow-hidden select-none">
    
    <!-- Background Pixel Clouds & Flying Dragon Decorative Header -->
    <div class="w-full max-w-2xl flex justify-between items-center opacity-70 pointer-events-none px-4 pt-2">
        <div class="text-4xl animate-bounce">☁️</div>
        <div class="text-5xl animate-pulse">🐉</div>
        <div class="text-4xl animate-bounce" style="animation-delay: 0.2s;">☁️</div>
    </div>

    <!-- Center Shaking Stage Container (Shaking White Dice Grid Only) -->
    <div class="flex flex-col items-center justify-center my-auto z-10">
        <div id="splash-dice-grid" class="flex flex-wrap items-center justify-center gap-3 sm:gap-5 my-2">
            <!-- Dynamically populated by JS during roll -->
        </div>
    </div>

    <!-- Bottom Pixel Art Scene Road / Walkers -->
    <div class="w-full max-w-3xl opacity-80 pointer-events-none border-t-2 border-amber-900/40 pt-2">
        <div class="flex justify-around items-center text-2xl sm:text-3xl text-gray-400">
            <span class="animate-pulse">🕶️</span>
            <span class="animate-bounce" style="animation-delay: 0.1s;">🐘</span>
            <span class="animate-pulse" style="animation-delay: 0.3s;">🕶️</span>
            <span class="animate-bounce" style="animation-delay: 0.2s;">🐘</span>
            <span class="animate-pulse" style="animation-delay: 0.4s;">🕶️</span>
        </div>
    </div>
</div>