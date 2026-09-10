import { test, expect } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:8000';
const ADMIN_KEY = 'godice12345'; // Sesuaikan dengan .env kamu
test.describe('GoDice Advanced & Security Test Suite', () => {

    // 1. Uji Middleware Admin Access
    test('1. Admin Secret Key Middleware Test', async ({ page }) => {
        // Tanpa Key -> Harus 404
        const unauthorizedRes = await page.goto(`${BASE_URL}/secret-admin`);
        expect(unauthorizedRes?.status()).toBe(404);

        // Dengan Key -> Harus 200
        const authorizedRes = await page.goto(`${BASE_URL}/secret-admin?key=${ADMIN_KEY}`);
        expect(authorizedRes?.status()).toBe(200);

        // Targetkan heading spesifik agar lolos Playwright Strict Mode
        await expect(page.getByRole('heading', { name: /ADMIN CONTROL CENTER/i })).toBeVisible();
    });

    // 2. Uji Sanitasi Stored XSS pada Form Streamer
    test('2. Stored XSS Payload Sanitization Test', async ({ page }) => {
        await page.goto(`${BASE_URL}/secret-admin?key=${ADMIN_KEY}`);

        const xssPayload = '<script>window.xssExecuted=true</script>';
        
        // Input form streamer
        await page.fill('#new-streamer-name', xssPayload);
        await page.fill('#new-streamer-handle', '@xss_test');
        await page.fill('#new-streamer-url', 'https://tiktok.com/@xss_test');

        // Klik tombol yang memiliki kata "Add"
        await page.click('button:has-text("Add")');
        await page.waitForTimeout(1000); // Tunggu respons simpan database

        // Buka halaman utama
        await page.goto(BASE_URL);

        // Memastikan script XSS TIDAK pernah dieksekusi di browser
        const isXssTriggered = await page.evaluate(() => window.xssExecuted || false);
        expect(isXssTriggered).toBeFalsy();

        // Cleanup: Hapus data streamer test
        const streamersRes = await page.request.get(`${BASE_URL}/api/admin/streamers`);
        if (streamersRes.ok()) {
            const { streamers } = await streamersRes.json();
            const testStreamer = streamers?.find(s => s.handle === '@xss_test');
            if (testStreamer) {
                await page.request.delete(`${BASE_URL}/api/admin/streamers/${testStreamer.id}`, {
                    headers: { 'X-Admin-Key': ADMIN_KEY }
                });
            }
        }
    });

    // 3. Uji Logika Rigging Warna Dadu (Preset Specific Game ID)
    test('3. Forced Color Rigging Mechanism Test', async ({ page }) => {
        // 1. Buka admin panel dengan secret key untuk mengambil CSRF token
        await page.goto(`${BASE_URL}/secret-admin?key=${ADMIN_KEY}`);
        const csrfToken = await page.locator('meta[name="csrf-token"]').getAttribute('content');

        const testGameId = 'TESTGAME123';

        // 2. Set Preset Rigging untuk Game ID Spesifik (Paksa warna 'Red' wajib keluar)
        const presetRes = await page.request.post(`${BASE_URL}/api/admin/preset-roll?key=${ADMIN_KEY}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Admin-Key': ADMIN_KEY,
                'X-CSRF-TOKEN': csrfToken || ''
            },
            data: {
                game_id: testGameId,
                excluded_colors: [],
                forced_colors: ['Red']
            }
        });

        expect(presetRes.ok()).toBeTruthy();

        // 3. Trigger Roll Dadu menggunakan Game ID tersebut
        const rollRes = await page.request.post(`${BASE_URL}/api/dice/roll`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || ''
            },
            data: { 
                game_id: testGameId,
                dice_count: 4 
            }
        });

        expect(rollRes.ok()).toBeTruthy();

        const rollData = await rollRes.json();
        
        // Pastikan warna 'Red' terbukti muncul pada hasil kocokan dadu
        expect(rollData.dice).toContain('Red');
        console.log(`[PASS] Rigging warna dadu berhasil dipaksa pada Game ID "${testGameId}" (Forced Color: Red).`);
    });
});