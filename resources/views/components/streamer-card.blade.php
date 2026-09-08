@props(['name', 'handle', 'url', 'verified' => true, 'is_live' => false])

<a href="{{ $url }}" target="_blank" rel="noopener noreferrer" class="card-inner p-2 rounded-xl flex items-center justify-between hover:bg-red-900/90 transition cursor-pointer border border-red-800 text-left group relative">
    <div class="flex items-center space-x-2.5 overflow-hidden">
        <!-- Avatar dengan Ring Merah saat LIVE -->
        <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center font-bold text-xs text-red-950 shrink-0 border border-yellow-200 {{ $is_live ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-red-950' : '' }}">
            {{ strtoupper(substr($name, 0, 1)) }}
            
            @if($is_live)
                <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border border-red-950 animate-pulse"></span>
            @endif
        </div>

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