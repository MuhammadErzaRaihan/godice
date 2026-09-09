@props([
    'name', 
    'handle', 
    'url', 
    'avatar_url' => null, 
    'verified' => true, 
    'is_live' => false
])

<a href="{{ $url }}" target="_blank" rel="noopener noreferrer" 
   class="card-inner p-2 rounded-xl flex items-center justify-between hover:bg-red-900/90 transition cursor-pointer border border-red-800 text-left group relative">
    
    <div class="flex items-center space-x-2.5 overflow-hidden">
        <!-- Avatar Container -->
        <div class="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-yellow-200/60 bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center {{ $is_live ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-red-950' : '' }}">
            
            @if($avatar_url)
                <img src="{{ $avatar_url }}" 
                     alt="{{ $name }}" 
                     class="w-full h-full object-cover relative z-10" 
                     onerror="this.style.display='none'">
            @endif

            <!-- Fallback Inisial (Otomatis muncul jika avatar_url null atau gagal dimuat) -->
            <span class="font-bold text-xs text-red-950 absolute inset-0 flex items-center justify-center">
                {{ strtoupper(substr($name, 0, 1)) }}
            </span>

            <!-- Dot indikator LIVE di pojok avatar -->
            @if($is_live)
                <span class="absolute top-0 right-0 z-20 w-2.5 h-2.5 bg-red-600 rounded-full border border-red-950 animate-pulse"></span>
            @endif
        </div>

        <!-- Info Streamer -->
        <div class="truncate">
            <div class="font-bold text-xs text-white group-hover:text-yellow-300 transition flex items-center gap-1">
                <span class="truncate">{{ $name }}</span>
                @if($verified)
                    <i class="fa-solid fa-circle-check text-sky-400 text-[10px]" title="Verified"></i>
                @endif
            </div>
            
            <div class="text-[10px] text-red-300 truncate flex items-center gap-1.5">
                <span>{{ $handle }}</span>
                @if($is_live)
                    <span class="text-[9px] font-black text-red-400 uppercase tracking-wider bg-red-950/80 px-1 rounded border border-red-800/80 animate-pulse">LIVE</span>
                @endif
            </div>
        </div>
    </div>

    <i class="fa-brands fa-tiktok text-red-400 text-xs shrink-0 group-hover:text-yellow-300"></i>
</a>