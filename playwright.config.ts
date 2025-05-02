import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

export default defineConfig({
  testDir: './tests',

  // fullyParallel: true,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 1,
  timeout: 30 * 1000,

  reporter: process.env.CI
    ? [
      [
        "./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
        {
          slackWebHookUrl: process.env.SLACK_WEBHOOK_URL,
          sendResults: "always", // "always" , "on-failure", "off"
          maxNumberOfFailuresToShow: 0,
          meta: [
            {
              key: ":easyjobs: EasyJobs - 🧪 Test Results",
              value: "<https://easyjobs.hurayraiit.com/ | 📂 May a few mins to update!>",
            },
          ],
        },
      ],
      ["html"],
    ]
    : [["dot"], ["list"], ["html"]],

  use: {
    baseURL: process.env.BASE_URL,

    // screenshot: "on",
    trace: "retain-on-failure",
    // video: "retain-on-failure",

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
