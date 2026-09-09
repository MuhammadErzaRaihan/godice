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
            $isLive = false;
            $avatarUrl = $streamer->avatar_url;

            try {
                // Tembak halaman profil TikTok utama
                $profileUrl = "https://www.tiktok.com/@{$handle}";
                
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language' => 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control' => 'no-cache',
                ])->timeout(10)->get($profileUrl);

                $status = $response->status();
                $html = $response->body();
                // Tambahkan baris ini tepat di dalam blok try setelah $html = $response->body();
                if (!str_contains($html, '__UNIVERSAL_DATA_FOR_REHYDRATION__')) {
                    $this->warn("Request ke @{$handle} diblokir Anti-Bot TikTok (Script Rehydration tidak ditemukan).");
                }
                if ($status !== 200) {
                    $this->warn("TikTok merespons HTTP {$status} untuk @{$handle}.");
                }

                // Ekstrak JSON state rehydration TikTok
                if (preg_match('/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s', $html, $matches)) {
                    $jsonData = json_decode($matches[1], true);
                    $userData = $jsonData['__DEFAULT_SCOPE__']['webapp.user-detail']['userInfo'] ?? null;

                    if ($userData) {
                        $roomId = $userData['user']['roomId'] ?? '0';
                        // Jika roomId bernilai selain '0' atau null, streamer sedang LIVE
                        $isLive = ($roomId !== '0' && $roomId !== 0 && !empty($roomId));
                        
                        // Ekstrak foto profil HD dari TikTok
                        $avatarUrl = $userData['user']['avatarLarger'] 
                                  ?? $userData['user']['avatarMedium'] 
                                  ?? $avatarUrl;

                        $this->info("Koneksi berhasil ke @{$handle} | Room ID: {$roomId}");
                    }
                }

                
                // Fallback pencarian manual jika script rehydration gagal diekstrak
                if (!$isLive && $status === 200) {
                    $isLive = (str_contains($html, '"status":2') || str_contains($html, '"liveRoom":true')) 
                              && !str_contains($html, '"status":4') 
                              && !str_contains($html, 'LIVE has ended');
                }

                if (!$avatarUrl) {
                    $avatarUrl = "https://unavatar.io/tiktok/{$handle}";
                }

                // Update status di MySQL
                $streamer->update([
                    'is_live' => $isLive,
                    'avatar_url' => $avatarUrl,
                ]);

                $statusText = $isLive ? '🔴 LIVE' : '⚪ OFFLINE';
                $this->info("Streamer {$streamer->name} (@{$handle}): {$statusText}");


            } catch (\Exception $e) {
                $this->error("Gagal mengecek streamer {$streamer->name}: " . $e->getMessage());
            }
            
            sleep(2); // Delay 2 detik untuk menghindari rate limit TikTok

        }
    }
}