<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TrackOnlineUsers
{
    public function handle(Request $request, Closure $next)
    {
        $identifier = null;

        // Baca mock_ip HANYA jika di lingkungan local/testing
        if (app()->environment('local', 'testing')) {
            $mockIp = $request->input('mock_ip') ?? $request->query('mock_ip');
            if ($mockIp) {
                $identifier = "mock_ip:{$mockIp}";
            }
        }

        // Jika di production atau tanpa mock_ip, gunakan Session ID / IP Asli
        if (!$identifier) {
            $identifier = $request->hasSession() ? $request->session()->getId() : $request->ip();
        }

        $onlineUsers = Cache::get('active_online_users_list', []);
        $onlineUsers[$identifier] = now()->addSeconds(60)->timestamp;

        // Filter session yang aktif
        $onlineUsers = array_filter($onlineUsers, fn($expireAt) => $expireAt > now()->timestamp);

        Cache::put('active_online_users_list', $onlineUsers, 120);

        return $next($request);
    }
}