<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiggedRoll extends Model
{
    protected $fillable = [
        'game_id', 
        'excluded_colors', 
        'forced_colors', 
        'is_used'
    ];

    protected $casts = [
        'excluded_colors' => 'array',
        'forced_colors' => 'array',
        'is_used' => 'boolean',
    ];

    protected $attributes = [
        'excluded_colors' => '[]',
        'forced_colors' => '[]',
        'is_used' => false,
    ];
}