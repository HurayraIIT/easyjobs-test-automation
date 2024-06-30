import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';

test.describe("auth and test", async () => {
  let candidateAuthHeaders: any;
  let companyAuthHeaders: any;

  test.beforeAll(async () => {
    candidateAuthHeaders = await createAuthHeaders(process.env.CANDIDATE_EMAIL, process.env.CANDIDATE_PASSWORD);
    companyAuthHeaders = await createAuthHeaders(process.env.COMPANY_EMAIL, process.env.COMPANY_PASSWORD);
  });

  test("Company API Calls Test", async ({ request }) => {
    const response = await request.get('/api/v2/company', {
      headers: companyAuthHeaders,
    });

    expect(response.status()).toBe(200);
  });

  test("Candidate API Calls Test", async ({ page, request }) => {
    const response = await request.get('/api/v2/candidate', {
      headers: candidateAuthHeaders,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    //console.log(body.data.candidate);
    //await createAssertions(body);
  });
});