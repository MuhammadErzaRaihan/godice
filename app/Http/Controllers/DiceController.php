<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\DiceRoll;
use App\Models\RigSetting;

class DiceController extends Controller
{
    public function index()
    {
        return view('dice.index');
    }

    public function verify()
    {
        return view('dice.verify');
    }

    /**
     * API: Eksekusi Roll Dadu dengan Sistem Rigging Terintegrasi Database
     */
    public function roll(Request $request)
    {
        $diceCount = (int) $request->input('dice_count', 4);
        $diceCount = max(1, min(6, $diceCount)); // Batasi 1 - 6 dadu

        $gameId = Str::random(10);
        $allColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];
    
        // Ambil aturan rigging aktif dari database
        $rig = RigSetting::where('is_active', true)->first();
        $excludedColors = $rig ? ($rig->excluded_colors ?? []) : [];

        // Eliminasi warna yang di-block oleh Admin
        $allowedColors = array_values(array_diff($allColors, $excludedColors));

        // Fallback jika semua warna ter-block
        if (empty($allowedColors)) {
            $allowedColors = $allColors;
        }

        // Generate hasil acak berdasarkan warna yang diizinkan
        $results = [];
        for ($i = 0; $i < $diceCount; $i++) {
            $results[] = $allowedColors[array_rand($allowedColors)];
        }

        // Simpan hasil ke database
        $roll = DiceRoll::create([
            'game_id' => $gameId,
            'dice_count' => $diceCount,
            'results' => $results,
            'client_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'game_id' => $roll->game_id,
            'dice' => $roll->results,
            'timestamp' => $roll->created_at->timestamp * 1000,
        ]);
    }

    /**
     * API: Ambil 20 Riwayat Roll Terakhir dari Database
     */
    public function history()
    {
        $history = DiceRoll::latest()->take(20)->get()->map(function ($item) {
            return [
                'game_id' => $item->game_id,
                'dice' => $item->results,
                'timestamp' => $item->created_at->timestamp * 1000,
            ];
        });

        return response()->json([
            'success' => true,
            'history' => $history
        ]);
    }

    /**
     * API: Audit Verifikasi Game ID untuk Halaman Verify
     */
    public function verifyAudit($gameId)
    {
        $roll = DiceRoll::where('game_id', $gameId)->first();

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