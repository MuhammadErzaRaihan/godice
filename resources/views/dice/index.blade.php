@extends('layouts.app')

@section('title', 'GO DICE — Virtual Dice Simulator')

@section('content')
<div id="view-main" class="transition-all duration-300">
    
    <!-- Pixel Art Stage Banner -->
    <div class="w-full max-w-3xl mx-auto mb-6 bg-red-900/40 border border-red-700/50 rounded-2xl p-4 text-center relative overflow-hidden backdrop-blur-sm shadow-xl">
        <div class="absolute -top-6 -left-6 opacity-20 text-6xl">🐉</div>
        <div class="absolute -bottom-6 -right-6 opacity-20 text-6xl">🌴</div>
        <h2 class="font-game text-3xl sm:text-4xl text-yellow-300 drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)] tracking-wide uppercase">
            GO DICE
        </h2>
        <p class="text-xs sm:text-sm font-semibold text-red-100 tracking-wider">VIRTUAL DICE SIMULATOR FOR LIVE STREAMS & GAMES</p>
    </div>

    <!-- Responsive 3-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        <!-- Desktop Left Column: Top Streamers Panel 1 -->
        <aside class="hidden lg:block lg:col-span-3 space-y-4">
            <div class="card-red rounded-2xl p-3 text-center shadow-2xl">
                <div class="flex items-center justify-between px-2 pb-2 border-b border-red-800/80 mb-3">
                    <span class="font-game text-sm text-yellow-300 tracking-wider">OUR TOP STREAMERS</span>
                    <span class="text-[10px] bg-red-900 px-2 py-0.5 rounded text-red-200 border border-red-700">LIVE</span>
                </div>
                <div id="desktop-streamers-left" class="space-y-2">
                    <!-- Populated via JS -->
                </div>
            </div>
        </aside>

        <!-- Center Column: Core Roll Color Dice Card -->
        <div class="lg:col-span-6 space-y-5">
            
            <!-- Main Card Container -->
            <div class="card-red rounded-3xl p-4 sm:p-6 shadow-2xl relative">
                
                <div class="text-center mb-4">
                    <h3 class="font-game text-2xl sm:text-3xl text-yellow-300 tracking-wide font-black drop-shadow">
                        ROLL COLOR DICE
                    </h3>
                </div>

                <!-- Top Dropdown Controls -->
                <div class="grid grid-cols-3 gap-2 mb-5">
                    <div>
                        <label class="block text-[10px] uppercase tracking-wider text-red-200 mb-1 font-bold">Dice Count</label>
                        <select id="select-dice-count" onchange="updateDiceCount(this.value)" class="w-full bg-red-950 border-2 border-red-700 text-yellow-300 text-xs sm:text-sm font-bold rounded-xl px-2 py-2 focus:outline-none focus:border-yellow-400 cursor-pointer text-center">
                            <option value="1">1 DICE</option>
                            <option value="2">2 DICE</option>
                            <option value="3">3 DICE</option>
                            <option value="4" selected>4 DICE</option>
                            <option value="5">5 DICE</option>
                            <option value="6">6 DICE</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] uppercase tracking-wider text-red-200 mb-1 font-bold">Dice Type</label>
                        <select class="w-full bg-red-950 border-2 border-red-700 text-yellow-300 text-xs sm:text-sm font-bold rounded-xl px-2 py-2 focus:outline-none focus:border-yellow-400 cursor-pointer text-center">
                            <option>COLORED</option>
                            <option>CLASSIC 6S</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] uppercase tracking-wider text-red-200 mb-1 font-bold">Theme / Variant</label>
                        <select id="theme-selector" onchange="switchTheme(this.value)" class="w-full bg-red-950 border-2 border-red-700 text-yellow-300 text-xs sm:text-sm font-bold rounded-xl px-2 py-2 focus:outline-none focus:border-yellow-400 cursor-pointer text-center">
                            <option value="arcade">SAB-RED</option>
                            <option value="pixel">PIXEL CRAFT</option>
                            <option value="luxury">LUXURY GOLD</option>
                            <option value="minimal">MINIMALIST</option>
                        </select>
                    </div>
                </div>

                <!-- Dice Grid Component -->
                <x-dice-grid />

                <!-- Game ID Banner & Verify Link -->
                {{-- <div class="flex items-center justify-between bg-red-950/90 rounded-xl px-3 py-2 border border-red-800 text-xs mb-3">
                    <div class="flex items-center space-x-2">
                        <span class="text-red-300 font-semibold">ID:</span>
                        <span id="current-game-id" class="font-mono font-bold text-yellow-300 tracking-wider">5xAbu7HCMb</span>
                    </div>
                    <button onclick="switchView('verify')" class="text-sky-300 hover:text-sky-200 underline font-semibold flex items-center gap-1">
                        <i class="fa-solid fa-circle-check text-xs"></i> Verify
                    </button>
                </div> --}}

                <!-- Warning Banner -->
                {{-- <div class="bg-sky-950/80 border border-sky-500/40 rounded-xl p-2 text-center text-xs text-sky-200 font-medium mb-4 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-circle-info text-sky-400"></i>
                    <span>Always verify the game ID for full transparency.</span>
                </div> --}}

                <!-- Action Button: GO AGAIN! -->
                <button id="btn-go-again" onclick="triggerRoll()" class="btn-yellow w-full py-3.5 px-6 rounded-2xl font-game text-2xl sm:text-3xl font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-3">
                    <span>GO AGAIN !</span>
                    <i class="fa-solid fa-rotate-right text-xl"></i>
                </button>

                <!-- Manual Counter Controls -->
                <div class="mt-4 bg-red-950/70 border border-red-800 rounded-2xl p-2.5 flex items-center justify-between">
                    <div class="flex space-x-1">
                        <button onclick="adjustCounter(-10)" class="bg-red-900 hover:bg-red-800 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg border border-red-700">-10</button>
                        <button onclick="adjustCounter(-1)" class="bg-red-900 hover:bg-red-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-red-700">-1</button>
                    </div>
                    
                    <div class="text-center px-4">
                        <span class="text-[10px] text-red-300 uppercase block font-bold tracking-wider">Manual Score</span>
                        <span id="manual-counter-value" class="font-game text-2xl font-bold text-yellow-300">0</span>
                    </div>

                    <div class="flex space-x-1">
                        <button onclick="adjustCounter(1)" class="bg-red-900 hover:bg-red-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-red-700">+1</button>
                        <button onclick="adjustCounter(10)" class="bg-red-900 hover:bg-red-800 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg border border-red-700">+10</button>
                    </div>
                </div>

                
                <!-- Roll Streak & Active Users -->
                <!-- Roll Streak & Active Users -->
                <div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                    <div class="bg-red-950/90 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-amber-300">
                        <span>Roll Streak:</span>
                        <span id="roll-streak-display" class="inline-flex items-center">
                            <div class="inline-flex items-center gap-1.5 bg-red-900/50 px-2.5 py-1 rounded-xl text-red-200 border border-red-700 shadow-sm ml-1">
                                <span class="font-bold text-xs">0</span>
                                <span class="text-xs">🔥</span>
                            </div>
                        </span>
                    </div>
                    
                    <div class="bg-red-950/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-emerald-300">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Users online: <strong id="users-online-count" class="text-white">792</strong></span>
                    </div>
                </div>

                <!-- Install App CTA Card -->
                <div class="mt-4 bg-red-950/60 border border-red-700/60 rounded-xl p-3 text-center flex items-center justify-between">
                    <div class="text-left">
                        <div class="font-bold text-sm text-yellow-300">INSTALL APP</div>
                        <div class="text-[11px] text-red-200">Get instant access on your mobile screen.</div>
                    </div>
                    <button onclick="alert('App installation shortcut ready!')" class="bg-yellow-400 hover:bg-yellow-300 text-red-950 text-xs font-black px-3 py-2 rounded-lg shadow">
                        GET APP
                    </button>
                </div>

                <!-- Colors Legend -->
                <div class="mt-4 text-center text-xs leading-relaxed text-red-200">
                    Possible colors are: 
                    <span class="text-red-400 font-bold">Red</span>, 
                    <span class="text-orange-400 font-bold">Orange</span>, 
                    <span class="text-yellow-300 font-bold">Yellow</span>, 
                    <span class="text-green-400 font-bold">Green</span>, 
                    <span class="text-blue-400 font-bold">Blue</span>, and 
                    <span class="text-purple-400 font-bold">Purple</span>.
                </div>

                <div class="mt-2 text-center">
                    <a href="#how-it-works" class="text-xs text-sky-300 hover:underline font-medium">See your chances of winning &rarr;</a>
                </div>

                <!-- Anti-Ban Switcher -->
                <div class="mt-5 pt-4 border-t border-red-800/80 flex items-center justify-between px-2">
                    <span class="text-xs font-bold text-red-200 flex items-center gap-2">
                        <i class="fa-solid fa-shield"></i> Anti-Ban Mode
                    </span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="toggle-antiban" onchange="toggleAntiBan(this.checked)" class="sr-only peer">
                        <div class="w-11 h-6 bg-red-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                </div>

            </div>

            <!-- Mobile Streamers Panel -->
            <div class="lg:hidden card-red rounded-2xl p-4 shadow-xl">
                <div class="flex items-center justify-between px-1 pb-2 border-b border-red-800 mb-3">
                    <span class="font-game text-sm text-yellow-300">OUR TOP STREAMERS</span>
                    <span class="text-[10px] bg-red-900 px-2 py-0.5 rounded text-red-200">LIVE</span>
                </div>
                <div id="mobile-streamers-list" class="space-y-2">
                    <!-- Populated via JS -->
                </div>
            </div>

            <!-- Last 20 Rolls Component -->
            <x-last-rolls />

            <!-- How It Works Card -->
            <div id="how-it-works" class="card-red rounded-3xl p-5 shadow-2xl space-y-3">
                <h4 class="font-game text-xl text-yellow-300 font-bold border-b border-red-800 pb-2">
                    HOW DO THESE VIRTUAL DICE WORK?
                </h4>
                <p class="text-xs leading-relaxed text-red-100">
                    This website uses virtual dice created with an algorithm that assigns equal probabilities to every possible outcome. By clicking on the "Go Again!" button you can re-roll all the dice on this page.
                </p>
                <p class="text-xs leading-relaxed text-red-100">
                    This page allows you to choose any number of dice between <strong class="text-yellow-300">1 and 6</strong>, each having 6 sides and 6 possible colors:
                    <span class="text-red-400 font-bold">Red</span>, 
                    <span class="text-orange-400 font-bold">Orange</span>, 
                    <span class="text-yellow-300 font-bold">Yellow</span>, 
                    <span class="text-green-400 font-bold">Green</span>, 
                    <span class="text-blue-400 font-bold">Blue</span>, and 
                    <span class="text-purple-400 font-bold">Purple</span>.
                </p>
            </div>

            <!-- About Us Card -->
            <div class="card-red rounded-3xl p-5 shadow-2xl space-y-3">
                <h4 class="font-game text-xl text-yellow-300 font-bold border-b border-red-800 pb-2">
                    ABOUT US
                </h4>
                <p class="text-xs leading-relaxed text-red-100">
                    Online-Dice.com is an online dice simulator that anyone can use to roll virtual dice when no real dice are available. With this free simulator you can roll dice for online games, board games, live stream games, or any other game of chance.
                </p>
            </div>

        </div>

        <!-- Desktop Right Column: Top Streamers Panel 2 -->
        <aside class="hidden lg:block lg:col-span-3 space-y-4">
            <div class="card-red rounded-2xl p-3 text-center shadow-2xl">
                <div class="flex items-center justify-between px-2 pb-2 border-b border-red-800/80 mb-3">
                    <span class="font-game text-sm text-yellow-300 tracking-wider">OUR TOP STREAMERS</span>
                    <span class="text-[10px] bg-red-900 px-2 py-0.5 rounded text-red-200 border border-red-700">FEATURED</span>
                </div>
                <div id="desktop-streamers-right" class="space-y-2">
                    <!-- Populated via JS -->
                </div>
            </div>
        </aside>

    </div>
</div>
@endsection