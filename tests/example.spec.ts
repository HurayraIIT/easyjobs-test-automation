import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createJob } from '@datafactory/job';

test.describe("auth and test", async () => {
  test.skip("create job", async ({ request }) => {
    const job = await createJob(authObjects.companyOneAuthHeaders);

    console.log(job);
  });
});