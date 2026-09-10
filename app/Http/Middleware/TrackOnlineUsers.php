<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TrackOnlineUsers
{
    public function handle(Request $request, Closure $next)
    {
        $mockIp = $request->input('mock_ip') ?? $request->query('mock_ip');
        
        // Identifikasi unik berdasarkan mock_ip atau Session ID
        $identifier = $mockIp ? "mock_ip:{$mockIp}" : ($request->hasSession() ? $request->session()->getId() : $request->ip());

        $onlineUsers = Cache::get('active_online_users_list', []);
        $onlineUsers[$identifier] = now()->addSeconds(60)->timestamp;

        // Filter dan buang session yang tidak aktif (> 60 detik)
        $onlineUsers = array_filter($onlineUsers, fn($expireAt) => $expireAt > now()->timestamp);

        Cache::put('active_online_users_list', $onlineUsers, 120);

        return $next($request);
    }
}