<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiceController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\AdminAccessMiddleware;

/*
|--------------------------------------------------------------------------
| Public Web Page View Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [DiceController::class, 'index'])->name('dice.index');
Route::get('/vip', [DiceController::class, 'vipIndex'])->name('dice.vip');
Route::get('/verify', [DiceController::class, 'verify'])->name('dice.verify');

/*
|--------------------------------------------------------------------------
| Public Engine & Streamer API Endpoints
|--------------------------------------------------------------------------
*/
Route::prefix('api')->group(function () {
    Route::post('/dice/roll', [DiceController::class, 'roll'])->name('api.dice.roll');
    Route::get('/dice/history', [DiceController::class, 'history'])->name('api.dice.history');
    Route::get('/dice/verify/{gameId}', [DiceController::class, 'verifyAudit'])->name('api.dice.verifyAudit');
    
    // PUBLIC: Dapat diakses oleh halaman utama tanpa terhalang AdminAccessMiddleware
    Route::get('/admin/streamers', [AdminController::class, 'getStreamers'])->name('api.admin.getStreamers');
});

/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Secret URL + Middleware)
|--------------------------------------------------------------------------
*/
Route::middleware([AdminAccessMiddleware::class])->group(function () {
    Route::get('/secret-admin', [AdminController::class, 'index'])->name('admin.index');

    Route::prefix('api/admin')->group(function () {
        Route::get('/rig', [AdminController::class, 'getRigSettings'])->name('api.admin.getRig');
        Route::post('/rig', [AdminController::class, 'updateRigSettings'])->name('api.admin.updateRig');
        Route::get('/preset-roll/{gameId}', [AdminController::class, 'getPresetRoll'])->name('api.admin.getPresetRoll');
        Route::post('/preset-roll', [AdminController::class, 'storePresetRoll'])->name('api.admin.storePresetRoll');
        
        // PROTECTED: Hanya Admin yang dapat menambah & menghapus streamer
        Route::post('/streamers', [AdminController::class, 'storeStreamer'])->name('api.admin.storeStreamer');
        Route::delete('/streamers/{id}', [AdminController::class, 'destroyStreamer'])->name('api.admin.destroyStreamer');
    });
});