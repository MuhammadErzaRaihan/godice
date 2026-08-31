<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiceRoll extends Model
{
    use HasFactory;

    protected $fillable = ['game_id', 'dice_count', 'results', 'client_ip'];

    protected $casts = [
        'results' => 'array',
    ];
}