import { test, expect, request } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createSkill } from '@datafactory/skill';

test.describe("auth and test", async () => {
  test("API Calls Test", async () => {
    // console.log(authObjects);
    console.log(await createSkill(authObjects.companyOneAuthHeaders));
  });
});