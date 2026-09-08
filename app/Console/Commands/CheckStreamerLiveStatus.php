<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Streamer;
use Illuminate\Support\Facades\Http;

class CheckStreamerLiveStatus extends Command
{
    protected $signature = 'streamers:check-live';
    protected $description = 'Cek status TikTok Live streamer secara otomatis';

    public function handle()
    {
        $streamers = Streamer::all();

        if ($streamers->isEmpty()) {
            $this->warn('Belum ada data streamer di database.');
            return;
        }

        foreach ($streamers as $streamer) {
            $handle = ltrim($streamer->handle, '@');
            $liveUrl = "https://www.tiktok.com/@{$handle}/live";

            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                ])->timeout(5)->get($liveUrl);

                $html = $response->body();

                // 1. Deteksi status LIVE
                $isLive = str_contains($html, '"liveRoom"') || str_contains($html, '"status":2');

                // 2. Ekstrak foto profil dari meta tag
                $avatarUrl = null;
                if (preg_match('/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i', $html, $matches)) {
                    $avatarUrl = html_entity_decode($matches[1]);
                }

                // 3. Update database
                $streamer->update([
                    'is_live' => $isLive,
                    'avatar_url' => $avatarUrl ?? $streamer->avatar_url,
                ]);

                $statusText = $isLive ? 'LIVE' : 'OFFLINE';
                $this->info("Streamer {$streamer->name} (@{$handle}): {$statusText}");

            } catch (\Exception $e) {
                $this->error("Gagal mengecek streamer {$streamer->name}: " . $e->getMessage());
            }
        }
    }
}