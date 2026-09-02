<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $secretKey = env('ADMIN_SECRET_KEY', 'godice12345');

        // Jika URL menyertakan parameter ?key=godice12345
        if ($request->query('key') === $secretKey) {
            session(['is_admin' => true]);
        }

        // Jika tidak punya akses session admin, tampilkan 404
        if (!session('is_admin')) {
            abort(404);
        }

        return $next($request);
    }
}