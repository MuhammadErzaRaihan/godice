<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiceController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Web Page View Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [DiceController::class, 'index'])->name('dice.index');
Route::get('/verify', [DiceController::class, 'verify'])->name('dice.verify');
Route::get('/admin-panel', [AdminController::class, 'index'])->name('admin.index');

/*
|--------------------------------------------------------------------------
| Engine API Endpoints (AJAX Operations)
|--------------------------------------------------------------------------
*/
Route::prefix('api')->group(function () {
    // Dice Engine & History Endpoints
    Route::post('/dice/roll', [DiceController::class, 'roll'])->name('api.dice.roll');
    Route::get('/dice/history', [DiceController::class, 'history'])->name('api.dice.history');
    Route::get('/dice/verify/{gameId}', [DiceController::class, 'verifyAudit'])->name('api.dice.verifyAudit');

    // Admin Rig & Streamer Management Endpoints
    Route::get('/admin/rig', [AdminController::class, 'getRigSettings'])->name('api.admin.getRig');
    Route::post('/admin/rig', [AdminController::class, 'updateRigSettings'])->name('api.admin.updateRig');
    Route::get('/admin/streamers', [AdminController::class, 'getStreamers'])->name('api.admin.getStreamers');
    Route::post('/admin/streamers', [AdminController::class, 'storeStreamer'])->name('api.admin.storeStreamer');
    Route::delete('/admin/streamers/{id}', [AdminController::class, 'destroyStreamer'])->name('api.admin.destroyStreamer');
});