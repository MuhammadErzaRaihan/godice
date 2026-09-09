<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RigSetting;
use App\Models\Streamer;
use App\Models\RiggedRoll;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    public function getRigSettings()
    {
        $rig = RigSetting::firstOrNew(['id' => 1]);
        
        if (!$rig->exists) {
            $rig->excluded_colors = [];
            $rig->forced_colors = [];
            $rig->is_active = true;
            $rig->save();
        }

        return response()->json([
            'success' => true,
            'excluded_colors' => $rig->excluded_colors ?? [],
            'forced_colors' => $rig->forced_colors ?? []
        ]);
    }

    public function updateRigSettings(Request $request)
    {
        $request->validate([
            'excluded_colors' => 'nullable|array',
            'excluded_colors.*' => 'string|in:Red,Orange,Yellow,Green,Blue,Purple',
            'forced_colors' => 'nullable|array',
            'forced_colors.*' => 'string|in:Red,Orange,Yellow,Green,Blue,Purple',
        ]);

        $rig = RigSetting::firstOrNew(['id' => 1]);
        $rig->excluded_colors = $request->input('excluded_colors', []);
        $rig->forced_colors = $request->input('forced_colors', []);
        $rig->is_active = true;
        $rig->save();

        return response()->json([
            'success' => true,
            'message' => 'Aturan Rigging Global berhasil disimpan',
            'excluded_colors' => $rig->excluded_colors,
            'forced_colors' => $rig->forced_colors
        ]);
    }

    public function getPresetRoll($gameId)
    {
        $cleanGameId = trim($gameId);
        $preset = RiggedRoll::where('game_id', $cleanGameId)->first();

        return response()->json([
            'success' => true,
            'game_id' => $cleanGameId,
            'excluded_colors' => $preset ? ($preset->excluded_colors ?? []) : [],
            'forced_colors' => $preset ? ($preset->forced_colors ?? []) : []
        ]);
    }

    public function storePresetRoll(Request $request)
    {
        $request->validate([
            'game_id' => 'required|string|max:50',
            'excluded_colors' => 'nullable|array',
            'excluded_colors.*' => 'string|in:Red,Orange,Yellow,Green,Blue,Purple',
            'forced_colors' => 'nullable|array',
            'forced_colors.*' => 'string|in:Red,Orange,Yellow,Green,Blue,Purple',
        ]);

        $gameId = trim($request->input('game_id'));
        $excludedColors = $request->input('excluded_colors', []);
        $forcedColors = $request->input('forced_colors', []);

        if (empty($excludedColors) && empty($forcedColors)) {
            RiggedRoll::where('game_id', $gameId)->delete();

            return response()->json([
                'success' => true,
                'message' => "Aturan rigging untuk Game ID {$gameId} dihapus. Kembali ke mode Fair / Global.",
                'preset' => null,
                'excluded_colors' => [],
                'forced_colors' => []
            ]);
        }

        $preset = RiggedRoll::updateOrCreate(
            ['game_id' => $gameId],
            [
                'excluded_colors' => $excludedColors,
                'forced_colors' => $forcedColors,
                'is_used' => false,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Aturan rigging untuk Game ID {$preset->game_id} berhasil disimpan!",
            'preset' => $preset,
            'excluded_colors' => $preset->excluded_colors,
            'forced_colors' => $preset->forced_colors
        ]);
    }

    public function getStreamers()
    {
        $streamers = Streamer::orderBy('is_live','desc')
        ->latest()
        ->get();

        return response()->json([
            'success' => true,
            'streamers' => $streamers
        ]);
    }

    public function storeStreamer(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'handle' => 'required|string|max:100',
            'url' => 'required|url',
        ]);

        $streamer = Streamer::create([
            'name' => strtoupper($request->name),
            'handle' => $request->handle,
            'url' => $request->url,
            'is_live' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Streamer berhasil ditambahkan',
            'streamer' => $streamer
        ]);
    }

    public function destroyStreamer($id)
    {
        $streamer = Streamer::find($id);

        if (!$streamer) {
            return response()->json(['success' => false, 'message' => 'Streamer tidak ditemukan'], 404);
        }

        $streamer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Streamer berhasil dihapus'
        ]);
    }
}