use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiceController;
use App\Http\Controllers\AdminController;

// --- PUBLIC ROUTES ---
Route::get('/', [DiceController::class, 'index'])->name('dice.index');
Route::post('/roll', [DiceController::class, 'roll'])->name('dice.roll');
Route::get('/verify/{game_id?}', [DiceController::class, 'verify'])->name('dice.verify');

// --- ADMIN CONTROL ROUTES ---
Route::prefix('admin-panel')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('index');
    Route::post('/toggle-rig', [AdminController::class, 'toggleRig'])->name('toggle-rig');
    Route::post('/preset-rig', [AdminController::class, 'applyPreset'])->name('preset-rig');
    Route::post('/streamers', [AdminController::class, 'addStreamer'])->name('streamers.add');
    Route::delete('/streamers/{id}', [AdminController::class, 'removeStreamer'])->name('streamers.remove');
});