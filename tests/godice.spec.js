import { test, expect } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:8000';

test.describe('GoDice Web Automation Test Suite', () => {

    // 1. Uji Halaman Utama & Feature Roll Dadu
    test('1. Public Roll Dice & Game ID Verification', async ({ page }) => {
        await page.goto(BASE_URL);

        // Pastikan judul GO DICE muncul
        await expect(page.locator('h2')).toContainText('GO DICE');

        // Klik tombol GO AGAIN !
        const rollBtn = page.locator('#btn-go-again');
        await expect(rollBtn).toBeVisible();
        await rollBtn.click();

        // Pastikan Game ID tidak lagi berupa placeholder
        const gameIdEl = page.locator('#current-game-id');
        await expect(gameIdEl).not.toHaveText('----------');
        
        const generatedGameId = await gameIdEl.innerText();
        console.log(`[PASS] Roll berhasil. Game ID Generated: ${generatedGameId}`);
    });

    // 2. Uji Keamanan VIP Link (Invalid Token Harus 404)
    test('2. Invalid VIP Link Returns 404', async ({ page }) => {
        const response = await page.goto(`${BASE_URL}/vip/invalid-token-12345`);
        
        // Memastikan server mengembalikan status 404 Not Found
        expect(response?.status()).toBe(404);
        console.log('[PASS] Token VIP palsu berhasil ditolak (404 Not Found).');
    });

    // 3. Uji VIP Link Valid (Harus Menampilkan Badge VIP ROOM)
    test('3. Valid VIP Link Displays Streamer Banner', async ({ page }) => {
        // Ganti dengan token yang ada di database kamu saat testing
        const validToken = 'vip-daniwrld-6zPSxLhE'; 
        
        const response = await page.goto(`${BASE_URL}/vip/${validToken}`);
        expect(response?.status()).toBe(200);

        // Pastikan elemen Badge VIP ROOM muncul di panggung
        const vipBadge = page.locator('span:has-text("VIP ROOM")');
        await expect(vipBadge).toBeVisible();
        console.log('[PASS] VIP Room valid dan berhasil memuat panggung streamer.');
    });

    // 4. Uji API Audit Game ID Endpoint Test
    test('4. API Audit Game ID Endpoint Test', async ({ page }) => {
        // 1. Buka halaman utama untuk mendapatkan session cookie & CSRF token
        await page.goto(BASE_URL);
        const csrfToken = await page.locator('meta[name="csrf-token"]').getAttribute('content');

        // 2. Gunakan page.request agar cookie laravel_session ikut terbawa
        const rollResponse = await page.request.post(`${BASE_URL}/api/dice/roll`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || ''
            },
            data: { dice_count: 4 }
        });

        // Debugging jika masih gagal
        if (!rollResponse.ok()) {
            console.error(`[FAIL DEBUG] Status: ${rollResponse.status()}`);
            console.error(`[FAIL DEBUG] Response: ${await rollResponse.text()}`);
        }

        expect(rollResponse.ok()).toBeTruthy();
        
        const rollData = await rollResponse.json();
        const gameId = rollData.game_id;

        // 3. Cek Audit Verification API
        const auditResponse = await page.request.get(`${BASE_URL}/api/dice/verify/${gameId}`, {
            headers: { 'Accept': 'application/json' }
        });
        expect(auditResponse.ok()).toBeTruthy();
        
        const auditData = await auditResponse.json();
        expect(auditData.game_id).toBe(gameId);
        expect(auditData.dice.length).toBe(4);
        console.log(`[PASS] API Audit Game ID "${gameId}" valid dan terverifikasi.`);
    });
});