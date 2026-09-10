<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DiceRoll;
use App\Models\RigSetting;
use App\Models\RiggedRoll;
use App\Models\Streamer;
use Illuminate\Support\Facades\Redis;

class DiceController extends Controller
{
    // public function index()
    // {
        
    //     return view('dice.index');
    // }

    public function index()
    {
        return view('dice.index', [
            'isVip' => false
        ]);
    }

    public function vipIndex($token)
    {
        // Cari streamer berdasarkan token rahasia
        $vipStreamer = Streamer::where('vip_token', trim($token))->first();

        // Jika token tidak cocok/tidak ditemukan, kembalikan 404 (URL dianggap tidak ada)
        if (!$vipStreamer) {
            abort(404);
        }

        return view('dice.index', [
            'isVip' => true,
            'vipStreamer' => $vipStreamer
        ]);
    }

    public function verify()
    {
        return view('dice.verify');
    }

    // private function getNetworkGameId(Request $request): string
    // {
    //     $hash = hash('sha256', $request->ip() . 'godice_salt_secret');
    //     $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    //     $charsLen = strlen($chars);
        
    //     $gameId = '';
    //     for ($i = 0; $i < 10; $i++) {
    //         $val = hexdec(substr($hash, $i * 2, 2));
    //         $gameId .= $chars[$val % $charsLen];
    //     }
        
    //     return $gameId;
    // }
    
    // private function getNetworkGameId(Request $request): string
    // {
    //     // Jika ada parameter mock_ip di URL, simpan ke session
    //     if ($request->has('mock_ip')) {
    //         session(['testing_mock_ip' => $request->query('mock_ip')]);
    //     }

    //     // Ambil IP dari Session (jika ada), jika tidak ada gunakan IP asli
    //     $clientIp = session('testing_mock_ip') 
    //         ?? $request->header('X-Mock-IP') 
    //         ?? $request->ip();

    //     $hash = hash('sha256', $clientIp . 'godice_salt_secret');
    //     $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    //     $charsLen = strlen($chars);
        
    //     $gameId = '';
    //     for ($i = 0; $i < 10; $i++) {
    //         $val = hexdec(substr($hash, $i * 2, 2));
    //         $gameId .= $chars[$val % $charsLen];
    //     }
        
    //     return $gameId;
    // }

    private function getNetworkGameId(Request $request): string
    {
        // Prioritas: Ambil langsung dari parameter mock_ip di Query/Form/Header.
        // Jika tidak ada, baru fallback ke $request->ip()
        $clientIp = $request->input('mock_ip') 
            ?? $request->query('mock_ip') 
            ?? $request->header('X-Mock-IP') 
            ?? $request->ip();

        $hash = hash('sha256', $clientIp . 'godice_salt_secret');
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $charsLen = strlen($chars);
        
        $gameId = '';
        for ($i = 0; $i < 10; $i++) {
            $val = hexdec(substr($hash, $i * 2, 2));
            $gameId .= $chars[$val % $charsLen];
        }
        
        return $gameId;
    }

    public function roll(Request $request)
    {
        $diceCount = (int) $request->input('dice_count', 4);
        $diceCount = max(1, min(6, $diceCount));

        $networkGameId = $this->getNetworkGameId($request);

        // $gameId = trim($request->input('game_id')) ?: $networkGameId;
        $rawGameId = trim($request->input('game_id')) ?: $networkGameId;
        $gameId = preg_replace('/[^a-zA-Z0-9_-]/', '', $rawGameId);
        $preset = RiggedRoll::where('game_id', $gameId)->first();
        $allColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

        $preset = RiggedRoll::where('game_id', $gameId)->first();

        $excludedColors = [];
        $forcedColors = [];

        if ($preset) {
            $excludedColors = $preset->excluded_colors ?? [];
            $forcedColors = $preset->forced_colors ?? [];
        } else {
            $rig = RigSetting::where('is_active', true)->first();
            $excludedColors = $rig?->excluded_colors ?? [];
            $forcedColors = $rig?->forced_colors ?? [];
        }

        if (is_string($excludedColors)) {
            $excludedColors = json_decode($excludedColors, true) ?? [];
        }
        if (is_string($forcedColors)) {
            $forcedColors = json_decode($forcedColors, true) ?? [];
        }

        $allowedColors = array_values(array_diff($allColors, $excludedColors));
        if (empty($allowedColors)) {
            $allowedColors = $allColors;
        }

        // Hanya warna wajib yang tidak diblokir yang diproses
        $validForcedColors = array_values(array_intersect($forcedColors, $allowedColors));

        // Pool warna untuk sisa slot dadu (warna wajib dikeluarkan agar tidak muncul > 1x)
        $remainingPool = array_values(array_diff($allowedColors, $validForcedColors));
        if (empty($remainingPool)) {
            $remainingPool = $allowedColors;
        }

        $results = [];

        // Masukkan tepat 1x untuk setiap warna wajib
        if (!empty($validForcedColors)) {
            foreach ($validForcedColors as $forcedColor) {
                if (count($results) < $diceCount) {
                    $results[] = $forcedColor;
                }
            }
        }

        // Sisa slot dadu diisi dari pool warna selain warna wajib
        while (count($results) < $diceCount) {
            $results[] = $remainingPool[array_rand($remainingPool)];
        }

        shuffle($results);

        $roll = DiceRoll::create([
            'game_id' => $gameId,
            'dice_count' => count($results),
            'results' => $results,
            'client_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'game_id' => $roll->game_id,
            'next_game_id' => $gameId,
            'dice' => $roll->results,
            'timestamp' => $roll->created_at->timestamp * 1000,
        ]);
    }

    // public function getOnlineCount()
    // {
    //     // Hitung berapa banyak key 'online_user:*' yang belum expired
    //     $keys = Redis::keys('online_user:*');
    //     $activeUsers = count($keys);

    //     return response()->json([
    //         'success' => true,
    //         'online_users' => max(1, $activeUsers) // Minimal 1 (pengunjung itu sendiri)
    //     ]);
    // }

    // public function history(Request $request)
    // {
    //     $networkGameId = $this->getNetworkGameId($request);

    //     $history = DiceRoll::latest()->take(20)->get()->map(function ($item) {
    //         return [
    //             'game_id' => $item->game_id,
    //             'dice' => $item->results,
    //             'timestamp' => $item->created_at->timestamp * 1000,
    //         ];
    //     });

    //     $keys = Redis::keys('online_user:*');
    //     $activeUsers = count($keys);

    //     return response()->json([
    //         'success' => true,
    //         'current_game_id' => $networkGameId,
    //         'online_users' => max(1, $activeUsers),
    //         'history' => $history
    //     ]);
    // }

    public function getOnlineCount()
    {
        $activeUsers = 1;
        try {
            $keys = Redis::keys('online_user:*');
            $activeUsers = max(1, count($keys));
        } catch (\Throwable $e) {
            // Default ke 1 user jika Redis offline di lokal
        }

        return response()->json([
            'success' => true,
            'online_users' => $activeUsers
        ]);
    }

    public function history(Request $request)
    {
        $networkGameId = $this->getNetworkGameId($request);

        $history = DiceRoll::latest()->take(20)->get()->map(function ($item) {
            return [
                'game_id' => $item->game_id,
                'dice' => $item->results,
                'timestamp' => $item->created_at->timestamp * 1000,
            ];
        });

        $activeUsers = 1;
        try {
            $keys = Redis::keys('online_user:*');
            $activeUsers = max(1, count($keys));
        } catch (\Throwable $e) {
            // Fallback jika Redis offline
        }

        return response()->json([
            'success' => true,
            'current_game_id' => $networkGameId,
            'online_users' => $activeUsers,
            'history' => $history
        ]);
    }
    public function verifyAudit($gameId)
    {
        $roll = DiceRoll::where('game_id', trim($gameId))->latest()->first();
        if (!$roll) {
            return response()->json([
                'success' => false,
                'message' => 'Game ID tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'game_id' => $roll->game_id,
            'dice' => $roll->results,
            'timestamp' => $roll->created_at->timestamp * 1000,
            'created_at_formatted' => $roll->created_at->format('Y-m-d H:i:s T'),
        ]);
    }
}