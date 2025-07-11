import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./auth-setup'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  timeout: 120000,
  
  expect: {
    timeout: 30000,
  },
  use: {
    baseURL: 'https://localhost:5001',
    storageState: './auth/LoginAuth.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 60000,
    navigationTimeout: 60000,
    //viewport: null,
    headless: true,
  },
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { 
  //       ...devices['Desktop Chrome'],
  //       headless: false,
  //       launchOptions: {
  //         args: [
  //           '--disable-web-security',
  //           '--disable-dev-shm-usage',
  //           '--no-sandbox',
  //           '--disable-setuid-sandbox',
  //           '--ignore-certificate-errors',
  //           '--ignore-ssl-errors'
  //         ]
  //       }
  //     },
  //   },
  // ],
  // webServer: {
  //   command: 'npm run start',
  //   url: 'https://localhost:5001',
  //   reuseExistingServer: !process.env.CI,
  //   ignoreHTTPSErrors: true,
  // },
}); 