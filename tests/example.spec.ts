import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createSkill } from '@datafactory/skill';

test.describe("auth and test", async () => {
  test("API Calls Test", async ({ request }) => {
    const response = await request.get(`/api/v2/calendly/event-type-list`, {
      headers: authObjects.companyOneAuthHeaders
    });

    const body = await response.json();
    // console.log(body);
  });
});