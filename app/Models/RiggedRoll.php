<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiggedRoll extends Model
{
    protected $fillable = ['game_id', 'excluded_colors', 'is_used'];

    protected $casts = [
        'excluded_colors' => 'array',
        'is_used' => 'boolean',
    ];
}