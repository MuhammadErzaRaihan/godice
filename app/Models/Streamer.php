<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Streamer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'handle', 'url', 'is_live'];

    protected $casts = [
        'is_live' => 'boolean',
    ];
}