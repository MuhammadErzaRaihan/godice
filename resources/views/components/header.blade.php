<header class="w-full bg-red-950/80 backdrop-blur-md border-b border-red-800/50 sticky top-0 z-40 px-4 py-2.5 shadow-lg">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        <!-- Logo Brand -->
        <a href="{{ route('dice.index') }}" class="flex items-center space-x-3 cursor-pointer">
            <div class="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center border-2 border-yellow-200 shadow-md text-red-900 font-black text-xl font-game">
                🎲
            </div>
            <div>
                <h1 class="font-game text-xl sm:text-2xl font-black tracking-wide text-yellow-300 drop-shadow-md leading-none">
                    ONLINE DICE
                </h1>
                <p class="text-[10px] tracking-widest text-red-200 uppercase font-semibold">Virtual Dice Simulator</p>
            </div>
        </a>

        <!-- Global View Nav Switcher -->
        <div class="flex items-center space-x-1 sm:space-x-2 bg-red-900/80 p-1 rounded-xl border border-red-700/60 text-xs sm:text-sm font-semibold">
            <a href="{{ route('dice.index') }}" 
               class="px-3 py-1.5 rounded-lg transition {{ request()->routeIs('dice.index') ? 'bg-yellow-400 text-red-950 font-bold shadow' : 'text-red-100 hover:bg-red-800/60' }}">
                <i class="fa-solid fa-dice mr-1.5"></i> Main Roller
            </a>
            <a href="{{ route('dice.verify') }}" 
               class="px-3 py-1.5 rounded-lg transition {{ request()->routeIs('dice.verify') ? 'bg-yellow-400 text-sky-950 font-bold shadow' : 'text-red-100 hover:bg-red-800/60' }}">
                <i class="fa-solid fa-shield-halved mr-1.5"></i> Verify
            </a>
            
        </div>

    </div>
</header>