namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DiceRoll;
use App\Models\Streamer;
use App\Models\RigSetting;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DiceController extends Controller
{
    private array $allColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

    public function index()
    {
        $streamers = Streamer::all();
        $recentRolls = DiceRoll::orderBy('rolled_at', 'desc')->take(20)->get();

        return view('dice.index', compact('streamers', 'recentRolls'));
    }

    public function roll(Request $request)
    {
        $diceCount = (int) $request->input('dice_count', 4);
        
        // Cek apakah ada warna yang di-exclude oleh Admin pada sesi ini
        $rigSetting = RigSetting::where('session_id', 'default_session')->first();
        $excluded = $rigSetting ? ($rigSetting->excluded_colors ?? []) : [];
        
        $availableColors = array_values(array_diff($this->allColors, $excluded));
        if (empty($availableColors)) {
            $availableColors = $this->allColors; // Fallback jika semua warna di-exclude
        }

        // Acak warna dadu berdasarkan warna yang tersedia
        $rollResults = [];
        for ($i = 0; $i < $diceCount; $i++) {
            $rollResults[] = $availableColors[array_rand($availableColors)];
        }

        $gameId = Str::random(10);
        
        $diceRoll = DiceRoll::create([
            'game_id' => $gameId,
            'dice_results' => $rollResults,
            'dice_count' => $diceCount,
            'session_id' => 'default_session',
            'rolled_at' => Carbon::now(),
        ]);

        return response()->json([
            'status' => 'success',
            'game_id' => $gameId,
            'dice' => $rollResults,
            'rolled_at' => $diceRoll->rolled_at->toIso8601String()
        ]);
    }

    public function verify($game_id = null)
    {
        $now = Carbon::now();
        $delayedThreshold = $now->copy()->subSeconds(10); // Simulasi delay 10 detik

        $recentDelayedRoll = DiceRoll::where('rolled_at', '<=', $delayedThreshold)
            ->orderBy('rolled_at', 'desc')
            ->first();

        $last50Rolls = DiceRoll::orderBy('rolled_at', 'desc')->take(50)->get();

        return view('dice.verify', compact('game_id', 'recentDelayedRoll', 'last50Rolls'));
    }
}