<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('rig_settings') && !Schema::hasColumn('rig_settings', 'forced_colors')) {
            Schema::table('rig_settings', function (Blueprint $table) {
                $table->json('forced_colors')->nullable()->after('excluded_colors');
            });
        }

        if (Schema::hasTable('rigged_rolls') && !Schema::hasColumn('rigged_rolls', 'forced_colors')) {
            Schema::table('rigged_rolls', function (Blueprint $table) {
                $table->json('forced_colors')->nullable()->after('excluded_colors');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('rig_settings') && Schema::hasColumn('rig_settings', 'forced_colors')) {
            Schema::table('rig_settings', function (Blueprint $table) {
                $table->dropColumn('forced_colors');
            });
        }

        if (Schema::hasTable('rigged_rolls') && Schema::hasColumn('rigged_rolls', 'forced_colors')) {
            Schema::table('rigged_rolls', function (Blueprint $table) {
                $table->dropColumn('forced_colors');
            });
        }
    }
};