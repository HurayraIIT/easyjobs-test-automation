import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
import { routes } from 'lib/routes';

config();

// calculate the number of endpoints with automation true in lib/routes.ts and calculate total routes
const automationEndpoints = routes.filter((route) => route.automated).length;
const totalRoutes = routes.length;
// calculate the % of automated routes
const automationPercentage = Math.round((automationEndpoints / totalRoutes) * 100);

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
          sendResults: "on-failure", // "always" , "on-failure", "off"
          maxNumberOfFailuresToShow: 0,
          meta: [
            {
              key: "Product:",
              value: ":easyjobs: *EasyJobs*",
            },
            {
              key: "Test Reports:",
              value: "<https://easyjobs.hurayraiit.com/ | 📂 Click me!> | May take a few mins to update.",
            },
            {
              key: `API Coverage:`,
              value: `*${automationEndpoints} / ${totalRoutes}* \`(${automationPercentage}%)\``,
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
