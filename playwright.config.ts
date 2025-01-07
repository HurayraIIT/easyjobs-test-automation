import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
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
              key: "Essential Addons Demo - Test Results",
              value: "<https://hurayraiit.github.io/essential-addons-demopage-test-automation/ | 📂 Click Here!>",
            },
          ],
        },
      ],
      ["html"],
    ]
    : [["dot"], ["list"], ["html"]],

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
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
