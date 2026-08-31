<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RigSetting;
use App\Models\Streamer;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    /**
     * API: Ambil Pengaturan Rigging Aktif
     */
    public function getRigSettings()
    {
        $rig = RigSetting::firstOrCreate(
            ['id' => 1],
            ['excluded_colors' => [], 'is_active' => true]
        );

        return response()->json([
            'success' => true,
            'excluded_colors' => $rig->excluded_colors ?? []
        ]);
    }

    /**
     * API: Update Aturan Blokir Warna (Rigging Control)
     */
    public function updateRigSettings(Request $request)
    {
        $request->validate([
            'excluded_colors' => 'array',
            'excluded_colors.*' => 'string|in:Red,Orange,Yellow,Green,Blue,Purple',
        ]);

        $rig = RigSetting::firstOrCreate(['id' => 1]);
        $rig->update([
            'excluded_colors' => $request->input('excluded_colors', []),
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Aturan Rigging berhasil disimpan',
            'excluded_colors' => $rig->excluded_colors
        ]);
    }

    /**
     * API: Ambil Daftar Streamer Aktif
     */
    public function getStreamers()
    {
        $streamers = Streamer::latest()->get();

        return response()->json([
            'success' => true,
            'streamers' => $streamers
        ]);
    }

    /**
     * API: Tambah Streamer Terverifikasi Baru
     */
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

    /**
     * API: Hapus Streamer
     */
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