import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createJob, getAllDraftJobs, deleteAllJobs } from '@datafactory/job';

test.describe("auth and test", async () => {
  test.skip("create job", async ({ request }) => {
    const new_job = await createJob(authObjects.companyOneAuthHeaders);
    const job = await getAllDraftJobs(authObjects.companyOneAuthHeaders);
    console.log(job);
  });
});