import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 30 * 1000,

  reporter: [["dot"], ["list"], ["html"]],

  use: {
    baseURL: process.env.BASE_URL,

    screenshot: "on",
    trace: "retain-on-failure",
    video: "retain-on-failure",

    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      "QATEST": `${process.env.QATEST_HEADER}`,
    }
  },
  projects: [
    {
      name: 'authenticate',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['authenticate'],
    },
  ],
});
