<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RigSetting;
use App\Models\Streamer;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Setup awal Rigging (Clean / Fair state)
        RigSetting::create([
            'excluded_colors' => [],
            'is_active' => true,
        ]);

        // Initial Streamers
        Streamer::create(['name' => 'FREXX GAMING', 'handle' => '@frexx100', 'url' => 'https://tiktok.com/@frexx100/live', 'is_live' => true]);
        Streamer::create(['name' => 'MEETS GAMING', 'handle' => '@meets_live', 'url' => 'https://tiktok.com/@meets_live/live', 'is_live' => true]);
        Streamer::create(['name' => 'UTOKIS', 'handle' => '@utokis_on', 'url' => 'https://tiktok.com/@utokis_on/live', 'is_live' => true]);
        Streamer::create(['name' => 'LERB', 'handle' => '@lerb942', 'url' => 'https://tiktok.com/@lerb942/live', 'is_live' => false]);
    }
}