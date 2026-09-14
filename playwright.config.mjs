import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: './tests/e2e', fullyParallel: false, workers: 1, timeout: 90000,
 use: { baseURL: 'http://localhost:5188', trace: 'retain-on-failure' },
});
