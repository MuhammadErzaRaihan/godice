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
            $rig->is_active = true;
            $rig->save();
        }

        return response()->json([
            'success' => true,
            'excluded_colors' => $rig->excluded_colors ?? []
        ]);
    }

    public function updateRigSettings(Request $request)
    {
        $request->validate([
            'excluded_colors' => 'nullable|array',
            'excluded_colors.*' => 'string|in:Red,Orange,Yellow,Green,Blue,Purple',
        ]);

        $rig = RigSetting::firstOrNew(['id' => 1]);
        $rig->excluded_colors = $request->input('excluded_colors', []);
        $rig->is_active = true;
        $rig->save();

        return response()->json([
            'success' => true,
            'message' => 'Aturan Rigging berhasil disimpan',
            'excluded_colors' => $rig->excluded_colors
        ]);
    }

    public function getStreamers()
    {
        $streamers = Streamer::latest()->get();

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
            'is_live' => true,
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

    /**
     * API: Simpan Preset Roll Berdasarkan Game ID
     */
    public function storePresetRoll(Request $request)
    {
        $request->validate([
            'game_id' => 'required|string|max:10',
            'excluded_colors' => 'nullable|array',
            'excluded_colors.*' => 'string|in:Red,Orange,Yellow,Green,Blue,Purple',
        ]);

        $preset = RiggedRoll::updateOrCreate(
            ['game_id' => $request->input('game_id')],
            [
                'excluded_colors' => $request->input('excluded_colors', []),
                'is_used' => false,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Blokir warna untuk Game ID {$preset->game_id} berhasil disimpan!",
            'preset' => $preset
        ]);
    }
}