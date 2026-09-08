<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dice_rolls', function (Blueprint $table) {
            $table->id();
            // Non-unique index allows multiple rolls under the same persistent Game ID
            $table->string('game_id')->index();
            $table->integer('dice_count');
            $table->json('results');
            $table->string('client_ip')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dice_rolls');
    }
};