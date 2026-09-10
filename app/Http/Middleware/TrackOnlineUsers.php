<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class TrackOnlineUsers
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $identifier = $request->hasSession() ? $request->session()->getId() : $request->ip();
            Redis::setex("online_user:{$identifier}", 60, true);
        } catch (\Throwable $e) {
            // Silently ignore jika Redis tidak aktif/tidak terpasang di environment lokal
        }

        return $next($request);
    }
}