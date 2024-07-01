import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createCategory, getAllCategories, deleteCategoryById } from '@datafactory/category';

test.describe("auth and test", async () => {
  let candidateAuthHeaders: any;
  let companyAuthHeaders: any;

  test.beforeAll(async () => {
    candidateAuthHeaders = await createAuthHeaders(process.env.CANDIDATE_EMAIL, process.env.CANDIDATE_PASSWORD);
    companyAuthHeaders = await createAuthHeaders(process.env.COMPANY_EMAIL, process.env.COMPANY_PASSWORD);
  });

  test("Company API Calls Test", async ({ page, request }) => {
    //await createBulkCategories(companyAuthHeaders, 10);
    let cat = await getAllCategories(companyAuthHeaders);
    console.log(cat.length);
  });
});