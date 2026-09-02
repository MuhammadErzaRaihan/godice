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
Route::get('/verify', [DiceController::class, 'verify'])->name('dice.verify');

/*
|--------------------------------------------------------------------------
| Public Engine API Endpoints
|--------------------------------------------------------------------------
*/
Route::prefix('api')->group(function () {
    Route::post('/dice/roll', [DiceController::class, 'roll'])->name('api.dice.roll');
    Route::get('/dice/history', [DiceController::class, 'history'])->name('api.dice.history');
    Route::get('/dice/verify/{gameId}', [DiceController::class, 'verifyAudit'])->name('api.dice.verifyAudit');
});

/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Secret URL + Middleware)
|--------------------------------------------------------------------------
*/
Route::middleware([AdminAccessMiddleware::class])->group(function () {
    // Halaman Admin dengan URL Rahasia
    Route::get('/secret-admin', [AdminController::class, 'index'])->name('admin.index');

    // API Admin (Rig Control & Streamers)
    Route::prefix('api/admin')->group(function () {
        Route::get('/rig', [AdminController::class, 'getRigSettings'])->name('api.admin.getRig');
        Route::post('/rig', [AdminController::class, 'updateRigSettings'])->name('api.admin.updateRig');
        Route::get('/streamers', [AdminController::class, 'getStreamers'])->name('api.admin.getStreamers');
        Route::post('/streamers', [AdminController::class, 'storeStreamer'])->name('api.admin.storeStreamer');
        Route::delete('/streamers/{id}', [AdminController::class, 'destroyStreamer'])->name('api.admin.destroyStreamer');
    });
});