<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RigSetting extends Model
{
    protected $table = 'rig_settings';

    protected $fillable = [
        'excluded_colors',
        'is_active',
    ];

    protected $casts = [
        'excluded_colors' => 'array',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'excluded_colors' => '[]',
        'is_active' => true,
    ];
}