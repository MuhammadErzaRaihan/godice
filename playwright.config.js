import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    channel: 'chrome', // Memaksa Playwright memakai Google Chrome lokal
    headless: false,   // Set 'true' jika ingin tes berjalan tanpa membuka jendela browser
  },
});