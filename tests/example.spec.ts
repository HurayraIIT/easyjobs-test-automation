import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createBulkEducations, deleteAllEducations } from '@datafactory/education';

test.describe("auth and test", async () => {
  let candidateAuthHeaders: any;
  let companyAuthHeaders: any;

  test.beforeAll(async () => {
    candidateAuthHeaders = await createAuthHeaders(process.env.CANDIDATE_EMAIL, process.env.CANDIDATE_PASSWORD);
    companyAuthHeaders = await createAuthHeaders(process.env.COMPANY_EMAIL, process.env.COMPANY_PASSWORD);
  });

  test("Candidate API Calls Test", async ({ page, request }) => {
    const response = await request.get('/api/v2/candidate', {
      headers: candidateAuthHeaders,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    await createBulkEducations(candidateAuthHeaders, 10);
  });
});